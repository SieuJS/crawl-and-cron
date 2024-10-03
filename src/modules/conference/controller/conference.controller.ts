import {
    Body,
    Controller,
    Get,
    HttpStatus,
    Inject,
    Post,
    PreconditionFailedException,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import { Service } from "../../tokens";
import { Config, LoggerService } from "../../common";
import { ConferenceService, WebScraperService } from "../service";
import { ConferenceData } from "../model/conference.data";
import { ConferenceInput } from "../model/conference.input";

import * as puppeteer from "puppeteer";

@Controller("conference")
@ApiTags("conference")
@ApiBearerAuth()
export class ConferenceController {
    public constructor(
        @Inject(Service.CONFIG)
        private readonly config: Config,
        private readonly logger: LoggerService,
        private readonly conferenceService: ConferenceService,
        private readonly webScraperService: WebScraperService
    ) {}

    @Get()
    @ApiOperation({ summary: "Find conference" })
    @ApiResponse({ status: HttpStatus.OK, isArray: true, type: ConferenceData })
    public async find(): Promise<ConferenceData[]> {
        return this.conferenceService.find();
    }

    @Post("create")
    @ApiOperation({ summary: "Create conference" })
    @ApiResponse({ status: HttpStatus.CREATED, type: ConferenceData })
    public async create(
        @Body() input: ConferenceInput
    ): Promise<ConferenceData> {
        if (this.config.CONFERENCE_ALLOWED === "no") {
            throw new PreconditionFailedException(
                "Not allowed to create conference"
            );
        }
        const conference = await this.conferenceService.create(input);
        this.logger.info(`Created new conference with ID ${conference.Id}`);

        return conference;
    }

    @Post("call")
    @ApiOperation({ summary: "Call conference" })
    @ApiResponse({ status: HttpStatus.OK, type: String })
    public async call(): Promise<string> {
        let browser;
        try {
            browser = await puppeteer.launch({
                executablePath:
                    process.env.NODE_ENV === "production"
                        ? process.env.PUPPETEER_EXECUTABLE_PATH
                        : puppeteer.executablePath(),
                headless: true,
                defaultViewport: null,
                args: [
                    "--disable-setuid-sandbox",
                    "--no-sandbox",
                    "--no-zygote",
                ],
                ignoreDefaultArgs: ["--enable-automation"],
            });
        } catch (error) {
            console.error("Failed to launch browser:", error);
            throw error;
        }
        console.log(">> Getting conference list from Core portal...");

        let conferenceList = await this.webScraperService.getConferenceList(
            browser
        );
        console.log(">> Get conference list successfully");
        // Step 2: Compare with conference list in Database
        const existingConferences = await this.conferenceService.find();
        conferenceList = await this.webScraperService.getNewConferences(
            conferenceList,
            existingConferences
        );

        // Step 3: For each new conference, get conference link
        console.log(">> Getting conferences link...");
        for (let i = 0; i < conferenceList.length; i++) {
            let conferenceLink =
                await this.webScraperService.searchConferenceLinks(
                    browser,
                    conferenceList[i],
                    4
                );
            conferenceList[i].Links = conferenceLink;
            // Store new conference
            await this.conferenceService.create({
                ...conferenceList[i],
                Id: undefined,
            });

            // Create ramdom time to outplay Captcha
            await setTimeout(function () {},
            Math.floor(Math.random() * 2000) + 1000);

            if (i == 5) break;
        }
        console.log(">> Get conferences link successfully");
        browser.close();
        return "Get conferences link successfully";
    }
    catch(error: Error) {
        console.error("Failed to get conference list:", error.message);
        throw error;
    }
}
