import {PickType} from '@nestjs/swagger';
import {ConferenceData} from './conference.data';
import { Injectable } from '@nestjs/common';
@Injectable()
export class ConferenceInput extends PickType(ConferenceData, ['Title', 'Acronym', 'Source', 'Rank', 'Note', 'DBLP', 'PrimaryFor', 'Comments', 'AverageRating', 'Links', 'ConferenceDate', 'SubmissionDate', 'NotificationDate', "Id", "Location", "Type"] as const) {

}