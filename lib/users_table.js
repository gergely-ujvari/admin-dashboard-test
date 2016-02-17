AdminConfig = {
    name: 'My App',
    adminEmails: ['ujvari@nolmecolindor.com'],
    collections: {
        Posts: {}
    }
    ,
    userColumns: [
        {label: 'Name', name: 'profile.name'}
    ],
    //// Disable editing of user fields:
    //userSchema: null,
    //
    // Use a custom SimpleSchema:
    userSchema: new SimpleSchema({
        'profile.name': {
            type: String
        }
    })
};

var adminDelButton, adminEditButton, adminEditDelButtons, adminTablesDom;
adminTablesDom = '<"box"<"box-header"<"box-toolbar"<"pull-left"<lf>><"pull-right"p>>><"box-body"t>><r>';
adminEditButton = {
    data: '_id',
    title: 'Edit',
    createdCell: function(node, cellData, rowData) {
        return $(node).html(Blaze.toHTMLWithData(Template.adminEditBtn, {
            _id: cellData
        }));
    },
    width: '40px',
    orderable: false
};
adminDelButton = {
    data: '_id',
    title: 'Delete',
    createdCell: function(node, cellData, rowData) {
        return $(node).html(Blaze.toHTMLWithData(Template.adminDeleteBtn, {
            _id: cellData
        }));
    },
    width: '40px',
    orderable: false
};
adminEditDelButtons = [adminEditButton, adminDelButton];

var extraColumns = _.map(AdminConfig.userColumns, function(column) {
    var createdCell;
    if (column.template) {
        createdCell = function(node, cellData, rowData) {
            $(node).html('');
            return Blaze.renderWithData(Template[column.template], {
                value: cellData,
                doc: rowData
            }, node);
        };
    }
    return {
        data: column.name,
        title: column.label,
        createdCell: createdCell
    };
});

// default view code, edit this to change the look
AdminTables.Users = new Tabular.Table({
    changeSelector: function(selector, userId) {
        var $or;
        $or = selector['$or'];
        $or && (selector['$or'] = _.map($or, function(exp) {
            var _ref;
            if (((_ref = exp.emails) != null ? _ref['$regex'] : void 0) != null) {
                return {
                    emails: {
                        $elemMatch: {
                            address: exp.emails
                        }
                    }
                };
            } else {
                return exp;
            }
        }));
        return selector;
    },
    name: 'Users',
    collection: Meteor.users,
    columns: _.union([
        {
            data: '_id',
            title: 'Admin',
            createdCell: function(node, cellData, rowData) {
                return $(node).html(Blaze.toHTMLWithData(Template.adminUsersIsAdmin, {
                    _id: cellData
                }));
            },
            width: '40px'
        }, {
            data: 'emails',
            title: 'Email',
            render: function(value) {
                return value[0].address;
            },
            searchable: true
        }, {
            data: 'emails',
            title: 'Mail',
            createdCell: function(node, cellData, rowData) {
                return $(node).html(Blaze.toHTMLWithData(Template.adminUsersMailBtn, {
                    emails: cellData
                }));
            },
            width: '40px'
        }, {
            data: 'createdAt',
            title: 'Joined'
        }
    ], extraColumns, adminEditDelButtons),
    dom: adminTablesDom,
});