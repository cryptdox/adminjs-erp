import {
  BeforeApplicationShutdown,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { CommonService } from './common/common.service.js';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService
  implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown
{
  constructor(
    private commonService: CommonService,
    private prisma: PrismaService
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async onModuleInit() {
    console.log(`The module has been initialized. abir signatured!`);
  }

  async onApplicationBootstrap() {
    try {
      // const adminFirebase = this.commonService.adminApp;
      // const firebase = this.commonService.app;

      // const auth = getAdminAuth()
      // // auth.getUserByPhoneNumber()
      // // var appVerifier = adminFirebase.auth().RecaptchaVerifier('recaptcha-container');
      // const phoneNumber = "+8801323987404"
      // var appVerifier = "1234";

      // adminFirebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
      //   .then((confirmationResult) => {
      //     // SMS sent successfully
      //     var code = prompt('Enter the verification code:', '');

      //     return confirmationResult.confirm(code);
      //   })
      //   .then((result) => {
      //     // User successfully signed in
      //     console.log(result.user);
      //   })
      //   .catch((error) => {
      //     // Handle errors
      //     console.error(error.message);
      //   });
      // const appVerifier = window.recaptchaVerifier;
      // signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      // signInWithPhoneNumber(phoneNumber, appVerifier)
      // const db = getFirestore(this.commonService.app);
      // const docRef = await addDoc(collection(db, "users"), {
      //   first: "Ada",
      //   last: "Lovelace",
      //   born: 1815
      // });
      // console.log("Document written with ID: ", docRef.id);

      // const checkInit = await this.commonService.checkInit()
      // if (!checkInit) {
      //   await this.commonService.initializeApplication();
      // }

      const initDBStatus = this.commonService.initDBStatus();
      // if (initDBStatus == 'RESET')
      await this.commonService.initializeDBData();

      console.log(`The module has been started. abir signatured!`);
    } catch (error) {
      throw error;
    }
  }

  async onModuleDestroy() {
    console.log('The module is destroying. abir signatured!');
  }

  beforeApplicationShutdown(signal: string) {
    console.log('The application is shutting down. abir signatured!', signal);
  }

  onApplicationShutdown(signal: string) {
    console.log('The application has shut down. abir signatured!', signal);
  }
}
