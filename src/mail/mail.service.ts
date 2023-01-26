import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

// import { I18n, I18nService } from 'nestjs-i18n';
import type { IMailData } from './interfaces/IMailData';

@Injectable()
export class MailService {
  constructor(
    // @I18n()
    // private i18n: I18nService,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  /**
   * It sends an email to the user with a link to reset their password
   * @param mailData - IMailData<{ hash: string; expires: number }>
   */
  async forgotPassword(mailData: IMailData<{ hash: string; expires: number }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Reset Password',
      text: `${this.configService.get('app.frontendDomain')}/password-change/${
        mailData.data.hash
      }`,
      template: 'reset-password',
      context: {
        title: 'Reset Your Password',
        url: `${this.configService.get('app.frontendDomain')}/password-change/${
          mailData.data.hash
        }`,
        actionTitle: 'Password reset request',
        app_name: this.configService.get('app.name'),
        text1: `Expires in ${mailData.data.expires} minutes.`,
        text2: 'reset-password.text2',
        text3: 'reset-password.text3',
        text4: 'reset-password.text4',
      },
    });
  }

  /**
   * It sends an email to the user with the email address provided in the mailData object
   * @param mailData - IMailData<{ name: string; docTitle: string }>
   */
  async forwardedDocument(
    mailData: IMailData<{ name: string; docTitle: string }>,
  ) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Document Submission',
      template: 'assignment',
      context: {
        title: 'A Document Needs Your Review',
        actionTitle: 'A Document Needs Your Review',
        app_name: this.configService.get('app.name'),
        text1: `${mailData.data.name}`,
        text2: `${mailData.data.docTitle}`,
      },
    });
  }

  /**
   * It sends an email to the user with the email address in the `to` property of the `mailData` object
   * @param mailData - IMailData<{ name: string; docTitle: string }>
   */
  async sendNudge(mailData: IMailData<{ name: string; docTitle: string }>) {
    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Document Review Pending',
      template: 'assignment',
      context: {
        title: 'A Document Is Still Awaiting Your Review',
        actionTitle: 'A Document Needs Your Review',
        app_name: this.configService.get('app.name'),
        text1: `${mailData.data.name}`,
        text2: `${mailData.data.docTitle}`,
      },
    });
  }

  // async userSignUp(mailData: IMailData<{ hash: string }>) {
  //   await this.mailerService.sendMail({
  //     to: mailData.to,
  //     subject: await this.i18n.t('common.confirmEmail'),
  //     text: `${this.configService.get('app.frontendDomain')}/confirm-email/${
  //       mailData.data.hash
  //     } ${await this.i18n.t('common.confirmEmail')}`,
  //     template: 'activation',
  //     context: {
  //       title: await this.i18n.t('common.confirmEmail'),
  //       url: `${this.configService.get('app.frontendDomain')}/confirm-email/${
  //         mailData.data.hash
  //       }`,
  //       actionTitle: await this.i18n.t('common.confirmEmail'),
  //       app_name: this.configService.get('app.name'),
  //       text1: await this.i18n.t('confirm-email.text1'),
  //       text2: await this.i18n.t('confirm-email.text2'),
  //       text3: await this.i18n.t('confirm-email.text3'),
  //     },
  //   });
  // }
  //
  // async forgotPassword(mailData: IMailData<{ hash: string }>) {
  //   await this.mailerService.sendMail({
  //     to: mailData.to,
  //     subject: await this.i18n.t('common.resetPassword'),
  //     text: `${this.configService.get('app.frontendDomain')}/password-change/${
  //       mailData.data.hash
  //     } ${await this.i18n.t('common.resetPassword')}`,
  //     template: 'reset-password',
  //     context: {
  //       title: await this.i18n.t('common.resetPassword'),
  //       url: `${this.configService.get('app.frontendDomain')}/password-change/${
  //         mailData.data.hash
  //       }`,
  //       actionTitle: await this.i18n.t('common.resetPassword'),
  //       app_name: this.configService.get('app.name'),
  //       text1: await this.i18n.t('reset-password.text1'),
  //       text2: await this.i18n.t('reset-password.text2'),
  //       text3: await this.i18n.t('reset-password.text3'),
  //       text4: await this.i18n.t('reset-password.text4'),
  //     },
  //   });
  // }
}
