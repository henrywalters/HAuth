import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApplicationDto } from "src/dtos/application.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Application } from "src/entities/application.entity";
import { Client } from "src/entities/client.entity";
import { Organization } from "src/entities/organization.entity";
import { Privilege } from "src/entities/privilege.entity";
import { Role } from "src/entities/role.entity";
import { Authorize } from "src/lib/Authorization.guard";
import { AuthorizeForOrg } from "src/lib/AuthorizeForOrg.guard";
import Crypto from "./../utilities/crypto";

@Controller("v1/application")
export class ApplicationController {
    
}