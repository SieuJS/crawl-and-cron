import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { ConferenceData, ConferenceInput } from '../model';
import { HttpStatus, HttpException } from '@nestjs/common';

@Injectable()
export class ConferenceService {
    
        public constructor(
            private readonly prismaService: PrismaService
        ) {

         }

        public async find(): Promise<ConferenceData[]> {
    
            const conferences = await this.prismaService.conference.findMany({});
    
            return conferences.map(conference => new ConferenceData(conference));
        }

        public async create(data: ConferenceInput): Promise<ConferenceData> {
            let conference ;
            try {
                conference = await this.prismaService.conference.create({
                    data :{
                        ...data, 
                        ConferenceDate : JSON.stringify(data.ConferenceDate),
                        SubmissionDate : JSON.stringify(data.SubmissionDate),
                        NotificationDate : JSON.stringify(data.NotificationDate),
                        Type: 'conference',
                        Location: "unknown"
                    }
                });    
            }
            catch (error) {
                throw new HttpException(`Error in createConference`, HttpStatus.SEE_OTHER);
            }
            return new ConferenceData(conference);
        } 

        public async update(id: string, data: ConferenceInput): Promise<ConferenceData> {
            let conference ;
            try {
                conference = await this.prismaService.conference.update({
                    where: { Id: id },
                    data: {
                        ...data,
                        ConferenceDate : JSON.stringify(data.ConferenceDate),
                        SubmissionDate : JSON.stringify(data.SubmissionDate),
                        NotificationDate : JSON.stringify(data.NotificationDate),
                        Type: 'conference',
                        Location: "unknown"
                    }
                });
            }
            catch (error) {
                throw new HttpException(`Error in updateConference`, HttpStatus.SEE_OTHER);
            }

            return new ConferenceData(conference);
        }
        


}
