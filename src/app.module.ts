import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AuthService } from './modules/auth/auth.service';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { UserController } from './modules/user/user.controller';
import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1/broadcast',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true, //DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
        useFindAndModify: false,
      },
    ),
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService, AuthService],
})
export class AppModule {}
