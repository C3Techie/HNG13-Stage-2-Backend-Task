import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

export class ImageGeneratorService {
  private cachePath: string;

  constructor() {
    this.cachePath = path.join(process.cwd(), 'src', 'cache');
    // Ensure cache directory exists
    if (!fs.existsSync(this.cachePath)) {
      fs.mkdirSync(this.cachePath, { recursive: true });
    }
  }

  async generateSummaryImage(
    totalCountries: number,
    topCountries: Array<{ name: string; estimated_gdp: number }>,
    lastRefreshed: Date
  ): Promise<string> {
    const width = 800;
    const height = 600;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, width, height);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Country Summary Report', width / 2, 60);

    // Total countries
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#16c784';
    ctx.fillText(`Total Countries: ${totalCountries}`, width / 2, 120);

    // Top 5 countries title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Top 5 Countries by Estimated GDP:', 50, 180);

    // Top 5 countries list
    ctx.font = '18px Arial';
    let yPosition = 220;
    topCountries.slice(0, 5).forEach((country, index) => {
      ctx.fillStyle = '#ffd700';
      ctx.fillText(`${index + 1}.`, 50, yPosition);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(country.name, 80, yPosition);
      
      ctx.fillStyle = '#16c784';
      const gdpFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(country.estimated_gdp);
      ctx.fillText(gdpFormatted, 400, yPosition);
      
      yPosition += 40;
    });

    // Last refreshed
    ctx.fillStyle = '#8e8e93';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    const formattedDate = lastRefreshed.toISOString();
    ctx.fillText(`Last Refreshed: ${formattedDate}`, width / 2, height - 40);

    // Save image
    const imagePath = path.join(this.cachePath, 'summary.png');
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(imagePath, buffer);

    return imagePath;
  }

  getImagePath(): string {
    return path.join(this.cachePath, 'summary.png');
  }

  imageExists(): boolean {
    const imagePath = this.getImagePath();
    return fs.existsSync(imagePath);
  }
}
