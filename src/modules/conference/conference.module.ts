import { Module } from '@nestjs/common';
import { CommonModule } from '../common';
import { ConferenceController } from './controller';
import { ConferenceService } from './service';
import { WebScraperService } from './service';

@Module({
    imports: [
        CommonModule,
    ],
    providers: [
        ConferenceService, WebScraperService
        
    ],
    controllers: [
        ConferenceController
    ],
    exports: []

})
export class ConferenceModule { }

