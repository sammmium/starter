class Main {

    config = {}

    database = {}

    /**
     * initialization of configuration and database
     */
    init() {
        let cnf = new Config();
        this.config = cnf.init();

        let db = new Database();
        this.database = db.init();
        this.initMenu();
    }

    /**
     * initializaion of menu
     */
    initMenu() {
        let menuItems = '';
        $.each(this.database.users, function(index, value) {
            let sex = '';
            switch (value.sex) {
                case "m":
                    sex = '<i class="fa-solid fa-person"></i>';
                    break;
                case "w":
                    sex = '<i class="fa-solid fa-person-dress"></i>';
                    break;
            }
            menuItems += '' +
                '<li class="nav-item">' +
                '   <span class="nav-link" id="' + index + '">' + sex + ' ' + value.name + '</span>' +
                '</li>';
        });
        menuItems += '' +
            '<li class="nav-item">' +
            '   <span class="nav-link actions" name="generator" title="Generate Id / Login / Password"><i class="fa-solid fa-spin fa-rotate"></i></span>' +
            '</li>';
        $('ul.navbar-nav.mr-auto').html(menuItems);
    }

    /**
     * preparing and rendering all items (list) of selected project/source/account
     * @param IID
     */
    showData(IID) {
        let container = $('#content-container');
        // clear container
        container.html('');

        this.addTable();
        this.addTableHead();
        this.addTableTbody();

        let i = 1;
        $.each(this.database.accounts, function (index, item) {
            if (item.IID === IID) {
                let link = '';
                if (item.target.url !== null) {
                    link = '    <a href="' + item.target.url + '" class="btn btn-outline-secondary" target="_blank" title="Move"><i class="fa-solid fa-link"></i></a>';
                }
                let descr = (item.description !== null) ? item.description : '';
                let highlighter = new Highlighter();
                let lightPeriod = highlighter.checkExpireDate(item);
                let expireSymbol = '';
                if (lightPeriod !== '') {
                    let message = highlighter.getMessage(lightPeriod);
                    expireSymbol = '<i class="fa-solid fa-circle-exclamation ' + lightPeriod + '" title="' + message + '"></i>';
                }
                $('tbody')
                    .append(
                        '<tr>' +
                        '  <td>' + i + '</th>' +
                        '  <td>' + item.target.name + ' ' + expireSymbol + '</td>' +
                        '  <td>' + descr + '</td>' +
                        '  <td>' + link + '</td>' +
                        '  <td>' +
                        '    <span name="login" class="actions btn btn-outline-secondary" data="' + index + '" title="Copy"><i class="fa-solid fa-copy"></i></span>' +
                        '  </td>' +
                        '  <td>' +
                        '    <span name="password" class="actions btn btn-outline-secondary" data="' + index + '" title="Copy"><i class="fa-solid fa-copy"></i></span>' +
                        '  </td>' +
                        '  <td>' +
                        '    <span name="more" class="actions btn btn-outline-secondary" data="' + index + '" title="More"><i class="fa-solid fa-bars"></i></span>' +
                        '  </td>' +
                        '</tr>'
                    );
                i++
            }
        });
    }

    /**
     * part of preparing list
     */
    addTable() {
        $('#content-container')
            .html('')
            .append(
                '<table class="table table-striped"></table>'
            );
    }

    /**
     * part of preparing list
     */
    addTableHead() {
        $('.table')
            .append(
                '<thead>' +
                '  <tr>' +
                '    <th class="col-1" scope="col">#</th>' +
                '    <th class="col-3" scope="col">Target Name</th>' +
                '    <th class="col-3" scope="col">Description</th>' +
                '    <th class="col-1" scope="col">Url</th>' +
                '    <th class="col-1" scope="col">Login</th>' +
                '    <th class="col-1" scope="col">Password</th>' +
                '    <th class="col-1" scope="col">Info</th>' +
                '  </tr>' +
                '</thead>'
            );
    }

    /**
     * part of preparing list
     */
    addTableTbody() {
        $('.table')
            .append(
                '<tbody></tbody>'
            );
    }

    /**
     * coping login or password of selected project/source/account
     * @param accountId
     * @param typeAccount
     */
    copyData(accountId, typeAccount) {
        let data = (typeAccount === 'login') ?
            this.database.accounts[accountId][typeAccount] :
            this.database.accounts[accountId][typeAccount].value.last;
        var copytext = document.createElement('input');
        copytext.value = data;
        document.body.appendChild(copytext);
        copytext.select();
        document.execCommand("copy");
        document.body.removeChild(copytext);
        this.showToast(typeAccount);
    }

    /* Modal */

    /**
     * clearing and filling by data of a modal window
     * @param accountId
     */
    openModal(accountId) {
        let data = this.database.accounts[accountId];

        let title = data.target.name;
        let url = (data.target.url !== null) ? data.target.url : '';
        let description = (data.description !== null) ? data.description : '';
        let tags = (data.tags !== null) ? data.tags : '';
        let login = data.login;
        let password = data.password.value.last;
        let passwordCreateAt = (data.password.change.last !== null) ? data.password.change.last : '';
        let passwordChangeAt = (data.password.change.next !== null) ? data.password.change.next : '';
        let passwordAbandoned = (data.password.value.prev !== null) ? data.password.value.prev : '';

        $('#staticBackdropLabel').html(title);
        $('#modalFormUrl').attr('value', url);
        $('#modalFormDescription').attr('value', description);
        $('#modalFormTags').attr('value', tags);
        $('#modalFormLogin').attr('value', login);
        $('#modalFormPassword').attr('value', password);
        $('#modalFormPasswordCreateAt').attr('value', passwordCreateAt);
        $('#modalFormPasswordChangeAt').attr('value', passwordChangeAt);
        $('#modalFormPasswordAbandoned').attr('value', passwordAbandoned);

        $('#showModal').click();
    }

    /**
     * clearing of a modal window
     */
    clearModal() {
        $('#staticBackdropLabel').html('');
        $('#modalFormUrl').attr('value', '');
        $('#modalFormDescription').attr('value', '');
        $('#modalFormTags').attr('value', '');
        $('#modalFormLogin').attr('value', '');
        $('#modalFormPassword').attr('value', '');
        $('#modalFormPasswordCreateAt').attr('value', '');
        $('#modalFormPasswordChangeAt').attr('value', '');
        $('#modalFormPasswordAbandoned').attr('value', '');
    }

    /* Toasts */

    /**
     * preparing, showing and hidding of each toast
     * @param typeAccount
     */
    showToast(typeAccount) {
        let data = '<div class="toast-container top-0 end-0 p-3">' +
            '        <div class="toast-login" role="alert" aria-live="assertive" aria-atomic="true">' +
            '          <div class="toast-header">' +
            '            <strong class="me-auto">' + typeAccount + ' copied</strong>' +
            '            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>' +
            '          </div>' +
            '        </div>' +
            '      </div>' +
            '    </div>';
        let toastContainer = $('.main-toast-container').append(data);
        let toastTarget = $('.main-toast-container').children().last();
        toastTarget.attr('id', this.getTimeId());
        const toast = new bootstrap.Toast(toastTarget);
        toast.show();
        this.removeHiddenToasts(typeAccount);
    }

    /**
     * preparing a time id for coloring of expire date of password
     * @returns {string}
     */
    getTimeId() {
        let date = new Date();
        let result = '';
        result += date.getFullYear();
        result += date.getMonth();
        result += date.getDate();
        result += date.getHours();
        result += date.getMinutes();
        result += date.getSeconds();
        result += date.getMilliseconds();
        return result;
    }

    /**
     * removing of early showed toasts
     * @param typeAccount
     */
    removeHiddenToasts(typeAccount) {
        $.each($('div.toast-container'), function (index, elem) {
            if (elem.className.indexOf('hide') !== -1) {
                elem.remove();
            }
        });
    }

    /* Generator */

    /**
     * generating and coping of encrypted data
     */
    generate() {
        let now = new Date();
        let year = now.getFullYear();
        let month = now.getMonth();
        let day = now.getDate();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        let seconds = now.getSeconds();
        let template = year + month + day + hours + minutes + seconds;
        let ciphertext = Aes.Ctr.encrypt(template, this.config.salt, 256);
        let copytext = document.createElement('input');
        copytext.value = ciphertext;
        document.body.appendChild(copytext);
        copytext.select();
        document.execCommand("copy");
        document.body.removeChild(copytext);
        this.showToast('Generated data ' + ciphertext);
    }
}

$(document).ready(function() {
    const starter = new Main();

    starter.init();

    $('.nav-link').click(function (event) {
        let IID = event.target.id;
        starter.showData(IID);
    });

    $(document).on('click', '.actions', function() {
        let typeAction = $(this).attr('name');
        let index = $(this).attr('data');
        switch (typeAction) {
            case 'login':
            case 'password':
                starter.copyData(index, typeAction);
                break;
            case 'more':
                starter.openModal(index);
                break;
            case 'generator':
                starter.generate();
                $('#content-container').html('');
                break;
        }
    });

    $('#go_home').click(function () {
        // clear container
        $('#content-container').html('');
    });

    $('.modal-close').click(function () {
        starter.clearModal();
    });
});
