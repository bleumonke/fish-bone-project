from models import Diagram

mockDiagrams: list[Diagram] = [
    Diagram(
        id="1",
        title="Missed Deadline",
        createdBy="You",
        createdAt="2024-06-12T09:00:00Z",
        updatedAt="2024-06-15T10:30:00Z",
        status="Published",
        tags=["Deadline", "Urgent"],
        bones=[
            {
                "id": "1-1",
                "name": "People",
                "createdBy": "You",
                "children": [
                    {"id": "1-1-1", "name": "Micromanaging Boss", "createdBy": "You"},
                ],
            },
            {
                "id": "1-2",
                "name": "Processes",
                "createdBy": "You",
                "children": [],
            },
        ],
    ),
    Diagram(
        id="2",
        title="System Crash",
        createdBy="Team",
        createdAt="2024-07-01T14:30:00Z",
        updatedAt="2024-07-02T08:15:00Z",
        status="Draft",
        tags=["IT", "Critical"],
        bones=[
            {
                "id": "2-1",
                "name": "Infrastructure",
                "createdBy": "DevOps",
                "children": [
                    {"id": "2-1-1", "name": "Outdated Servers", "createdBy": "DevOps"},
                ],
            },
            {
                "id": "2-2",
                "name": "Software",
                "createdBy": "Engineering",
                "children": [],
            },
        ],
    ),
    Diagram(
        id="3",
        title="Low Customer Satisfaction",
        createdBy="You",
        createdAt="2024-05-20T11:15:00Z",
        updatedAt="2024-06-01T09:00:00Z",
        status="Published",
        tags=["Customer", "Feedback"],
        bones=[
            {
                "id": "3-1",
                "name": "Support",
                "createdBy": "Support Lead",
                "children": [
                    {"id": "3-1-1", "name": "Slow Response Time", "createdBy": "Support Lead"},
                    {"id": "3-1-2", "name": "Untrained Staff", "createdBy": "Support Lead"},
                ],
            },
            {
                "id": "3-2",
                "name": "Product",
                "createdBy": "Product Owner",
                "children": [
                    {"id": "3-2-1", "name": "Frequent Bugs", "createdBy": "Product Owner"},
                ],
            },
        ],
    ),
    Diagram(
        id="4",
        title="High Employee Turnover",
        createdBy="HR",
        createdAt="2024-03-10T08:45:00Z",
        updatedAt="2024-04-01T14:20:00Z",
        status="Archived",
        tags=["HR", "Retention"],
        bones=[
            {
                "id": "4-1",
                "name": "Culture",
                "createdBy": "HR",
                "children": [
                    {"id": "4-1-1", "name": "Lack of Recognition", "createdBy": "HR"},
                    {"id": "4-1-2", "name": "Toxic Environment", "createdBy": "HR"},
                ],
            },
            {
                "id": "4-2",
                "name": "Compensation",
                "createdBy": "Finance",
                "children": [],
            },
        ],
    ),
    Diagram(
        id="5",
        title="Project Overbudget",
        createdBy="PMO",
        createdAt="2024-02-25T13:20:00Z",
        updatedAt="2024-03-05T10:10:00Z",
        status="Published",
        tags=["Budget", "Project"],
        bones=[
            {
                "id": "5-1",
                "name": "Planning",
                "createdBy": "PMO",
                "children": [
                    {"id": "5-1-1", "name": "Unclear Scope", "createdBy": "PMO"},
                ],
            },
            {
                "id": "5-2",
                "name": "Execution",
                "createdBy": "Project Manager",
                "children": [
                    {"id": "5-2-1", "name": "Vendor Delays", "createdBy": "Project Manager"},
                    {"id": "5-2-2", "name": "Resource Misallocation", "createdBy": "Project Manager"},
                ],
            },
        ],
    ),
]