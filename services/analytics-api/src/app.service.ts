import { Injectable } from '@nestjs/common';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = "G-1D03475J80";

@Injectable()
export class AppService {
  async getData() {
    const analyticsDataClient = new BetaAnalyticsDataClient();
    await this.runReport(analyticsDataClient);
    return propertyId;
  }
  
  async runReport(analyticsDataClient: BetaAnalyticsDataClient) {
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '2023-06-03',
          endDate: 'today',
        },
      ],
      dimensions: [
        {
          name: 'city',
        },
      ],
      metrics: [
        {
          name: 'activeUsers',
        },
      ],
    });
    console.log('Report result:');
    response.rows.forEach(row => {
      console.log(row.dimensionValues[0], row.metricValues[0]);
    });
  }
}
