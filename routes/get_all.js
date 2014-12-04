var get_all = {
    get_all_data: function () {
        console.log("bla bla");
    }
};

module.exports = function (router) {
    router.get('/', get_all.get_all_data());
    return router;
};