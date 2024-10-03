import {  HttpException, HttpStatus } from "@nestjs/common";
import { Browser } from "puppeteer";
import { getConferencesOnPage, getTotalPages } from "./web-scraper-utils-provider";
import { Conference, ConferenceData } from "../../model";
export class WebScraperService {
    constructor() {}

    public getConferenceList = getConferenceList;
    public searchConferenceLinks = searchConferenceLinks;
    public getNewConferences = getNewConferences;
}

export async function getConferenceList(
    browser: Browser
): Promise<Array<Conference>> {
    try {
        const currentLink = `${process.env.PORTAL}?search=&by=${process.env.BY}&source=${process.env.CORE2023}&sort=${process.env.SORT}&page=${process.env.PAGE}`;
        const totalPages = await getTotalPages(
            browser,
            currentLink
        );
        let allConferences = Array<Conference>();

        for (let i = 1; i <= totalPages; i++) {
            const conferencesOnPage =
                await getConferencesOnPage(
                    browser,
                    `${currentLink.slice(0, -1)}${i}`
                );
            
            allConferences = allConferences.concat(conferencesOnPage.filter((conference) => conference.Title !== ""));

            break;
        }
        return allConferences;
    } catch (error) {
        console.error("Error in getConferenceList:", error);
        throw error;
    }
}

export async function searchConferenceLinks(
    browser: Browser,
    conference: Conference,
    maxLinks: number = 4
): Promise<string[]> {
    try {
        // Số lượng liên kết tối đa cần thu thập
        // Mảng chứa các liên kết
        let links: string[] = [];

        // Mở tab mới
        let page = await browser.newPage();
        page.setDefaultNavigationTimeout(10000);
        // Tìm kiếm trên Google với từ khóa là Acronym + 2023
        await page.goto("https://www.google.com/");
        await page.waitForSelector("#APjFqb");
        await page.keyboard.sendCharacter(conference.Acronym + " 2023");
        await page.keyboard.press("Enter");
        await page.waitForNavigation();
        await page.waitForSelector("#search");

        while (links.length < maxLinks) {
            const linkList = await page.$$eval("#search a", (els) => {
                const result = [];
                const unwantedDomains = [
                    "scholar.google",
                    "translate.google",
                    "google.com",
                    "wikicfp.com",
                    "dblp.org",
                    "medium.com",
                    "dl.acm.org",
                    "easychair.org",
                    "youtube.com",
                ];
                for (const el of els) {
                    const href = el.href;
                    // Kiểm tra xem liên kết có chứa tên miền không mong muốn
                    if (
                        !unwantedDomains.some((domain) =>
                            href.includes(domain)
                        )
                    ) {
                        result.push({
                            link: href,
                        });
                    }
                }
                return result;
            });

            links = links.concat(linkList.map((item) => item.link));

            // Nếu links có nhiều hơn maxLinks, cắt bớt
            if (links.length > maxLinks) {
                links = links.slice(0, maxLinks);
            }

            if (links.length < maxLinks) {
                // Chưa đủ liên kết, tiếp tục tìm kiếm bằng cách cuộn xuống
                await page.keyboard.press("PageDown");
            }
        }
        await page.close();
        return links.slice(0, maxLinks);
    } catch (error) {
        console.log("Error in searchConferenceLinks:", error);
        // Xử lý lỗi
        throw new HttpException(
            "Error in searchConferenceLinks",
            HttpStatus.SEE_OTHER
        );
    }
}

export async function getNewConferences(
    conferenceList: Conference[],
    existingConferences: ConferenceData[]
): Promise<Conference[]> {
    const newConferences = conferenceList.filter(
        (conference) =>
            !existingConferences.some(
                (existingConference) =>
                    existingConference.Acronym === conference.Acronym
            )
    );

    return newConferences;
}

