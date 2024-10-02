
import { Browser } from "puppeteer";
import { ConfDate } from "../../model/confdate";

import { Conference } from "../../model/conference.interface";
export function isFakeNews (array: ConfDate[], keywordToCheck: string): boolean {
  return array.some((item) =>
    item.keyword?.toLowerCase().includes(keywordToCheck.toLowerCase())
  );
}

export async function getTotalPages (browser: Browser, url: string): Promise<number>  {
  console.log(">> Getting total pages...");
  const page = await browser.newPage();
  await page.goto(url);
  const totalPages = await page.evaluate(() => {
    const pageElements = document.querySelectorAll("#search > a");
    let maxPage = 1;
    pageElements.forEach((element) => {
      const pageValue =
        element.textContent?.length || 0 < 5
          ? parseInt(element.textContent || "")
          : 0;
      if (!isNaN(pageValue) && pageValue > maxPage) {
        maxPage = pageValue;
      }
    });
    return maxPage;
  });
  return totalPages;
}

export async function getConferencesOnPage(browser: Browser, currentLink: string): Promise<Conference[]> {
  try {
    const page = await browser.newPage();
    await page.goto(currentLink);
    await page.waitForSelector("#container");

    const scrapeData = await page.$$eval("#search > table tr", (rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return (
          {
          Id :"",
          Title: cells[0]?.innerText || "",
          Acronym: cells[1]?.innerText || "",
          Source: cells[2]?.innerText || "",
          Rank: cells[3]?.innerText || "",
          Note: cells[4]?.innerText || "",
          DBLP: cells[5]?.innerText || "",
          PrimaryFor: cells[6]?.innerText || "",
          Comments: cells[7]?.innerText || "",
          AverageRating: cells[8]?.innerText || "",
          ConferenceDate : [], 
          SubmissionDate : [],
          NotificationDate : [],
          Type :"", 
          Location : "",
          Links : [],
        } as Conference);
      })
    );
    await page.close();

    return scrapeData;


  } catch (error) {
    throw error;
  }
}
export class WebScraperUtils {
  constructor() {}
  public formatString (str: string): string {
    return (
      str
        .replace(/(\s0)([1-9])\b/g, "$2")
        .replace(/(\d+)(st|nd|rd|th),/g, "$1,")
    );
  };


  public isFakeNews (array: ConfDate[], keywordToCheck: string): boolean {
    return array.some((item) =>
      item.keyword?.toLowerCase().includes(keywordToCheck.toLowerCase())
    );
  }

  public async getTotalPages (browser: Browser, url: string): Promise<number>  {
    console.log(">> Getting total pages...");
    const page = await browser.newPage();
    await page.goto(url);
    const totalPages = await page.evaluate(() => {
      const pageElements = document.querySelectorAll("#search > a");
      let maxPage = 1;
      pageElements.forEach((element) => {
        const pageValue =
          element.textContent?.length || 0 < 5
            ? parseInt(element.textContent || "")
            : 0;
        if (!isNaN(pageValue) && pageValue > maxPage) {
          maxPage = pageValue;
        }
      });
      return maxPage;
    });
    return totalPages;
  }

  public async getConferencesOnPage(browser: Browser, currentLink: string): Promise<any> {
    try {
      const page = await browser.newPage();
      await page.goto(currentLink);
      await page.waitForSelector("#container");

      const scrapeData = await page.$$eval("#search > table tr", (rows) =>
        rows.map((row) => {
          const cells = row.querySelectorAll("td");
          return {
            Title: cells[0]?.innerText || "",
            Acronym: cells[1]?.innerText || "",
            Source: cells[2]?.innerText || "",
            Rank: cells[3]?.innerText || "",
            Note: cells[4]?.innerText || "",
            DBLP: cells[5]?.innerText || "",
            PrimaryFoR: cells[6]?.innerText || "",
            Comments: cells[7]?.innerText || "",
            AverageRating: cells[8]?.innerText || "",
          };
        })
      );

      await page.close();
      return scrapeData;
    } catch (error) {
      throw error;
    }
  }
}
