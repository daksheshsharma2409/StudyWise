export function getResourceOrderBy(sort) {
    switch (sort) {
        case "top":
            return { votes: { _count: "desc" } };
        case "views":
            return { views: "desc" };
        case "recent":
        default:
            return { createdAt: "desc" };
    }
}
