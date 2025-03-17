import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class EmailService {
  constructor(private configurationService: ConfigurationService) {}

  emailTransport() {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: this.configurationService.getEmailConfig().host,
      port: this.configurationService.getEmailConfig().port,
      secure: false,
      auth: {
        user: this.configurationService.getEmailConfig().user,
        pass: this.configurationService.getEmailConfig().password,
      },
    });
    return transporter;
  }

  async sendEmail(email: string, content: string) {
    await this.emailTransport().sendEmail({
      from: this.configurationService.getEmailConfig().user,
      to: email,
      subject: 'Weather Report',
      html: content,
    });
  }
}
