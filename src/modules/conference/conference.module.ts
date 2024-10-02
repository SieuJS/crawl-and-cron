import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ConferenceController } from './controller';
import { ConferenceService } from './service';
import { WebScraperUtils } from './service/web-scraper-service/web-scraper-utils-provider';

@Module({
    imports: [
        CommonModule,
    ],
    providers: [
        ConferenceService, WebScraperUtils
        
    ],
    controllers: [
        ConferenceController
    ],
    exports: []

})
export class ConferenceModule { }

