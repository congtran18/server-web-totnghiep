import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../projects.controller';
import { CreateProjectDto } from '../dto/create-project.dto'

import { ProjectsService } from "../projects.service"
import { projectStub } from "./stubs/project.stub";
import { Project } from '../schemas/project.schema';
var isodate = require("isodate");

jest.mock('../projects.service');

describe('ProjectController Test', () => {
  let projectsController: ProjectsController;
  let projectsService: ProjectsService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [ProjectsService],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
    jest.clearAllMocks();
  });

  it('it should be defined', () => {
    expect(projectsController).toBeDefined();
  });

  describe('try get Project By Id', () => {
    const expectedResult = projectStub();
    const mockId = projectStub()._id;
    let project: Project;

    beforeEach(async () => {
      jest
        .spyOn(projectsService, 'getSingleProject')
        .mockResolvedValue(expectedResult);
      project = await projectsController.getProject(mockId)
    })

    it('then it should call projectsService', () => {
      expect(projectsService.getSingleProject).toBeCalledWith(expectedResult._id);
    });

    it('should return an Project if successful', () => {
      expect(
        (project)
      ).toEqual(expectedResult);
    });

  });

  describe('try get All Project', () => {
    const expectedResult = Array(5).fill(projectStub());
    let projects: Project[];

    beforeEach(async () => {
      jest
        .spyOn(projectsService, 'filterProject')
        .mockResolvedValue(expectedResult);
      projects = (await projectsController.getAllProjects('', '', '', '1', '0'))
    })

    it('then it should call projectsService', () => {
      expect(projectsService.filterProject).toHaveBeenCalled();
    })

    it('should return an array of Project if successful', () => {
      expect(projects).toEqual(
        expectedResult,
      );
    });
  });

  describe('try to Create a Project', () => {
    const expectedResult: CreateProjectDto = projectStub();
    let createProject: Project;

    beforeEach(async () => {
      jest
        .spyOn(projectsService, 'insertNewProject')
        .mockResolvedValue(expectedResult);
      createProject = (await projectsController.createNewProject(projectStub()))
    })

    it('then it should call projectsService', () => {
      expect(projectsService.insertNewProject).toHaveBeenCalledWith(projectStub());
    })

    it('should create a project if successful', () => {
      expect(createProject).toEqual(
        expectedResult,
      );
    });
  });

  describe('try to Update a Project', () => {
    const expectedResult: CreateProjectDto = projectStub();
    const mockId = projectStub()._id;
    let updateProject: Project;

    beforeEach(async () => {
      jest
        .spyOn(projectsService, 'editProject')
        .mockResolvedValue(expectedResult);
      updateProject = (await projectsController.updateSmartContract(mockId, projectStub()))
    })

    it('then it should call projectsService', () => {
      expect(projectsService.editProject).toHaveBeenCalledWith(mockId, projectStub());
    })

    it('should update a project if successful', () => {
      expect(updateProject).toEqual(
        expectedResult,
      );
    });
  });

  describe('try to delete a Project By Id', () => {
    const expectedResult = projectStub();
    const mockId = projectStub()._id;
    let deleteProject: Project;

    beforeEach(async () => {
      jest
        .spyOn(projectsService, 'removeProject')
        .mockResolvedValue(expectedResult);
      deleteProject = (await projectsController.deleteProject(mockId))
    })

    it('then it should call projectsService', () => {
      expect(projectsService.removeProject).toBeCalledWith(mockId);
    })

    it('should delete an Project if successful', () => {
      expect(
        deleteProject,
      ).toEqual(expectedResult);
    });
  });

});