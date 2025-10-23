export const API_LIST = [
    {
        name: "Production Key",
        key: "sk_live_...a4f2",
        status: "Active",
        statusColor: "green",
        perm: "Read, Write",
        used: "2 hours ago",
    },
    {
        name: "Staging Environment",
        key: "sk_test_...b8e1",
        status: "Active",
        statusColor: "green",
        perm: "Read-only",
        used: "1 day ago",
    },
    {
        name: "Old Integration Key",
        key: "sk_live_...c3d9",
        status: "Revoked",
        statusColor: "red",
        perm: "Write",
        used: "3 months ago",
    },
    {
        name: "Temporary Access Key",
        key: "sk_temp_...e7f0",
        status: "Expired",
        statusColor: "yellow",
        perm: "Read-only",
        used: "1 week ago",
    },
]


export const BASE_URL = "https://api.khain.app"