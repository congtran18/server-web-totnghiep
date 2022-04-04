import { Test, TestingModule } from '@nestjs/testing';
// import { getRepositoryToken } from '@nestjs/typeorm';
import httpMocks  from 'node-mocks-http';
jest.mock('../projects.service');
import { Project } from '../schemas/project.schema';
import { CreateProjectDto } from '../dto/create-project.dto'
import { ProjectsService } from "../projects.service"
import { projectStub } from "./stubs/project.stub";
var isodate = require("isodate");

describe('ProjectsService Test', () => {
    
    let projectsService: ProjectsService;

    beforeAll(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService,
            ],
        })
        .compile();

        projectsService = moduleRef.get<ProjectsService>(ProjectsService);
    });


    it('should be defined', () => {
        expect(projectsService).toBeDefined();
    });

    describe('#getSingleProject', () => {
        const expectedResult : CreateProjectDto = projectStub();
        describe('when getUserById is called', () => {
            let project: Project;

            beforeEach(async () => {
                jest
                .spyOn(projectsService, 'getSingleProject')
                .mockResolvedValue(expectedResult);
                project = await projectsService.getSingleProject(projectStub()._id);
            });

            test('then it should return a user', () => {
                expect(project).toEqual(expectedResult);
            });
        });
    });

    describe('#getProjects', () => {
        describe('when getUsers is called', () => {
            const expectedResult = Array(5).fill(projectStub());
            let projects: Project[];

            beforeEach(async () => {
                jest
                .spyOn(projectsService, 'filterProject')
                .mockResolvedValue(expectedResult);
                projects = await projectsService.filterProject('','','','','');
            });

            test('then it should return a list of projects', () => {
                expect(projects).toEqual(expectedResult);
            });
        });
    });

    describe('#createProject', () => {
        describe('when createProject is called', () => {
            const expectedResult : CreateProjectDto = projectStub();
            let projectInsert: Project;

            beforeEach(async () => {
                jest
                .spyOn(projectsService, 'insertNewProject')
                .mockResolvedValue(expectedResult);
                projectInsert = await projectsService.insertNewProject(projectStub());
            });

            test('then it should return a new user', () => {
                expect(projectInsert).toEqual(projectStub());
            });
        });
    });

    describe('#updateProject', () => {
        describe('when updateProject is called', () => {
            const expectedResult : CreateProjectDto = projectStub();
            let projectUpdate: Project;
            const mockId = projectStub()._id;

            beforeEach(async () => {
                jest
                .spyOn(projectsService, 'editProject')
                .mockResolvedValue(expectedResult);
                projectUpdate = await projectsService.editProject(mockId, projectStub());
            });

            test('then it should call with id and new update', () => {
                expect(projectsService.editProject).toBeCalledWith(
                    mockId,
                    projectStub()
                );
            });

            test('then it should return the updated project object', () => {
                expect(projectUpdate).toEqual(projectStub());
            });
        });
    });

});
