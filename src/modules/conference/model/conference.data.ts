import { ApiProperty } from "@nestjs/swagger";
import { Conference } from "@prisma/client";
import { ConfDate } from "./confdate";
export class ConferenceData {
    public static readonly NAME_LENGTH = 50; 
    @ApiProperty ({description: 'Id', example: '1'})
    public readonly Id: string | undefined;

    @ApiProperty ({description: 'Title', example: 'Conference Title'})
    public readonly Title: string; 

    @ApiProperty ({description : "Acronym", example: "Conf"}) 
    public readonly Acronym: string; 

    @ApiProperty ({description: "Source",
    example: "https://www.google.com"})
    public readonly Source: string;
    
    @ApiProperty ({description : "Rank", example: "A"}) 
    public readonly Rank: string;

    @ApiProperty ({description: "Note", example: "Require bachelor"}) 
    public readonly Note: string;

    @ApiProperty ({description : "DBLP", example: "https://dblp.org/db/conf/xxx"})
    public readonly DBLP: string; 

    @ApiProperty ({description : "Primary for" , example: "Computer Science"})
    public  readonly PrimaryFor: string;

    @ApiProperty ({description : "Comments", example : "Good conference"})
    public readonly Comments: string; 

    @ApiProperty ({description : "AverageRating" , example: "4.5"})
    public  readonly AverageRating: string;

    @ApiProperty ({description : "Links", example: ["confhub.com"]})
    public  Links: string[]; 

    @ApiProperty ({description : "Conference Date" , example: [ {
        "date": "2020-07-31T00:00:00.000Z",
        "keyword": "Doctoral Consortium",
        "update_time": "2024-09-25T07:57:39.189Z"
      }]})
    public  readonly ConferenceDate: ConfDate[];

    @ApiProperty ({description : "Submission Date", example: [{
        "date": "2020-06-26T00:00:00.000Z",
        "keyword": "Full papers due",
        "update_time": "2024-09-25T07:57:39.188Z"
      },
      {
        "date": "2023-06-09T00:00:00.000Z",
        "keyword": "Abstracts",
        "update_time": "2024-09-25T07:57:39.188Z"
      }]}) 
    public readonly SubmissionDate: ConfDate[];

    @ApiProperty ({description : "Notification Date" , example: [{
        "date": "2020-08-07T00:00:00.000Z",
        "keyword": "notification",
        "update_time": "2024-09-25T07:57:39.189Z"
      }]})
    public  readonly NotificationDate: ConfDate[];

    @ApiProperty ({description : "Location", example: "unknown"})
    public readonly Location: string | null;

    @ApiProperty ({description : "Type", example: "conference"})
    public readonly Type: string | null;
    
    public constructor(entity: Conference) {
        this.Id = entity?.Id;
        this.Title = entity.Title;
        this.Acronym = entity.Acronym;
        this.Source = entity.Source;
        this.Rank = entity.Rank;
        this.Note = entity.Note;
        this.DBLP = entity.DBLP;   
        this.PrimaryFor = entity.PrimaryFor;    
        this.Comments = entity.Comments;
        this.AverageRating = entity.AverageRating;
        this.Links = entity.Links;
        this.ConferenceDate = JSON.parse(entity.ConferenceDate as unknown as string) as ConfDate[];
        this.SubmissionDate = JSON.parse(entity.SubmissionDate as unknown as string) as ConfDate[];;
        this.NotificationDate = JSON.parse(entity.NotificationDate as unknown as string) as ConfDate[];
        this.Location = entity.Location;
        this.Type = entity.Type;
    }

    
}