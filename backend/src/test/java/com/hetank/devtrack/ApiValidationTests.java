package com.hetank.devtrack;

import com.hetank.devtrack.model.Project;
import com.hetank.devtrack.repository.ProjectRepository;
import com.hetank.devtrack.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiValidationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @BeforeEach
    void cleanDatabase() {
        taskRepository.deleteAll();
        projectRepository.deleteAll();
    }

    @Test
    void rejectsBlankProjectName() throws Exception {
        mockMvc.perform(
                post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "",
                                  "description": "Test project",
                                  "status": "ACTIVE"
                                }
                                """)
        ).andExpect(status().isBadRequest());
    }

    @Test
    void createsValidProject() throws Exception {
        mockMvc.perform(
                post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Portfolio",
                                  "description": "Internship portfolio",
                                  "status": "ACTIVE"
                                }
                                """)
        )
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Portfolio"));
    }

    @Test
    void rejectsBlankTaskTitle() throws Exception {
        Project project = new Project();
        project.setName("Test Project");
        project.setDescription("Project used by the API test");

        project = projectRepository.save(project);

        String requestBody = """
                {
                  "title": "",
                  "description": "Test task",
                  "status": "TODO",
                  "priority": "MEDIUM",
                  "projectId": %d
                }
                """.formatted(project.getId());

        mockMvc.perform(
                post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody)
        ).andExpect(status().isBadRequest());
    }
}
