const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 0;

function getPagination({page,limit}){
    page = page || DEFAULT_PAGE;
    limit = limit || DEFAULT_LIMIT;
    const skip = (page - 1) * limit;    
    return {
        skip,
        limit
    }
}

module.exports = {
    getPagination
}