class Highlighter {

    /* Highlighter of expire date */

    warningPeriod = {
        period: "7",
        light: "warning-period"
    }

    attentionPeriod = {
        period: "14",
        light: "attention-period"
    }

    noticePeriod = {
        period: "30",
        light: "notice-period"
    }

    messages = {
        "warning-period": "Password will expire soon or has already expired",
        "attention-period": "Password will expire soon (it is no more than 14 days)",
        "notice-period": "Password will expire in the nearest future (it is no more than 30 days)"
    }

    checkExpireDate(item) {
        if (item.password.change.next !== null) {
            let date1 = new Date();
            let date2 = new Date(item.password.change.next);
            if (date2.getTime() < date1.getTime()) {
                return this.warningPeriod.light;
            }
            let diffDays = this.getDiff(date1, date2);
            if (diffDays <= this.warningPeriod.period) {
                return this.warningPeriod.light;
            }
            if (diffDays <= this.attentionPeriod.period) {
                return this.attentionPeriod.light;
            }
            if (diffDays <= this.noticePeriod.period) {
                return this.noticePeriod.light;
            }
        }
        return '';
    }

    getDiff(date1, date2) {
        let timeDiff = Math.abs(date2.getTime() - date1.getTime());
        return  Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    getMessage(light) {
        return this.messages[light];
    }
}