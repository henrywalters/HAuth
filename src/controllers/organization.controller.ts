import { Body, Controller, Get, Headers, Param, Post, Put, Res, UseGuards } from "@nestjs/common";
import { isRgbColor } from "class-validator";
import { AddUserDto, OrganizationDto } from "src/dtos/organization.dto";
import { ResponseDto } from "src/dtos/response.dto";
import { Organization } from "src/entities/organization.entity";
import { Privilege } from "src/entities/privilege.entity";
import { Role } from "src/entities/role.entity";
import { User } from "src/entities/user.entity";
import { Authorize } from "src/lib/Authorization.guard";

@Controller("v1/organization")
export class OrganizationController {
    @Post()
    @UseGuards(Authorize)
    public async createOrganization(@Headers("user") user: User, @Body() req: OrganizationDto) {
        const org = new Organization();
        org.name = req.name;
        org.domain = req.domain;
        org.restrictUsersToDomain = req.restrictUsersToDomain;
        org.owner = user;

        const ownerPrivileges = await Privilege.createPrivileges([
            'VIEW_INFO',
            'EDIT_INFO',
            'ADD_USER',
            'REMOVE_USER',
            'VIEW_USER',
            'ADD_APPLICATION',
            'EDIT_APPLICATION',
            'REMOVE_APPLICATION',
            'ADD_PRIVILEGE',
            'REMOVE_PRIVILEGE',
            'EDIT_PRIVILEGE',
            'ADD_ROLE',
            'REMOVE_ROLE',
            'EDIT_ROLE',
        ], true);

        const ownerRole = await Role.createRole('OWNER', ownerPrivileges, true);

        org.roles = [ownerRole];

        user.roles = user.roles ? user.roles : [];
        user.roles.push(ownerRole);

        await org.save();
        return ResponseDto.Success(org);
    }

    @Get(":id")
    @UseGuards(Authorize)
    public async getOrganization(@Headers("user") user: User, @Param("id") id: string) {
        const organization = await Organization.findOne(id);
        if (!organization) return ResponseDto.Error("Organization does not exist");
        if (organization.owner.id !== user.id) return ResponseDto.Error("Unauthorized to perform this action");
        return ResponseDto.Success(organization);
    }

    @Put(":id")
    @UseGuards(Authorize)
    public async updateOrganization(@Headers("user") user: User, @Param("id") id: string, @Body() req: OrganizationDto) {
        const organization = await Organization.findOne(id);
        if (!organization) return ResponseDto.Error("Organization does not exist");
        if (organization.owner.id !== user.id) return ResponseDto.Error("Unauthorized to perform this action");
        organization.name = req.name;
        organization.domain = req.domain;
        organization.restrictUsersToDomain = req.restrictUsersToDomain;
        await organization.save();
        return ResponseDto.Success(organization);
    }

    @Get()
    @UseGuards(Authorize)
    public async getOwnedOrganizations(@Headers("user") user: User) {
        console.log(user);
        return ResponseDto.Success(await Organization.find({
            where: {
                owner: user,
            }
        }))
    }

    @Get(":id/user")
    @UseGuards(Authorize)
    public async getUsers(@Headers("user") user: User, @Param("id") id: string) {
        const organization = await Organization.findOne(id);
        if (!organization) return ResponseDto.Error("Organization does not exist");
        if (organization.owner.id !== user.id) return ResponseDto.Error("Unauthorized to perform this action");
        
        const query = await User.createQueryBuilder('user')
            .innerJoin('user.organizations', 'organization', 'organization.id = :id', {id});

        return ResponseDto.Success(await query.getMany());
    }

    @Post(":id/user")
    @UseGuards(Authorize)
    public async addUser(@Headers("user") user: User, @Param("id") id: string, @Body() req: AddUserDto) {
        const organization = await Organization.findOne(id);
        if (!organization) return ResponseDto.Error("Organization does not exist");
        if (organization.owner.id !== user.id) return ResponseDto.Error("Unauthorized to perform this action");

        const newUser = await User.findOne({
            where: {
                email: req.email,
            }
        });

        if (!newUser) return ResponseDto.Error("This user is not registered");

        const domain = newUser.email.split('@')[1];

        if (organization.restrictUsersToDomain && domain !== organization.domain) {
            return ResponseDto.Error("Email must belong to domain: " + organization.domain);
        }

        newUser.organizations = newUser.organizations ? newUser.organizations : [];
        newUser.organizations.push(organization);
        await newUser.save();

        return ResponseDto.Success(newUser);
    }

}