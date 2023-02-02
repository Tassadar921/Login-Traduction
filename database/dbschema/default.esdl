module default {
    type Permission {
        required property name -> str;
    }

    type User {
        required property username -> str;
        required property firstname -> str;
        required property lastname -> str;
        required property password -> str;
        required property email -> str;
        required property birthdate -> datetime {
            default := datetime_current()
        };
        required property token -> str;
        link permission -> Permission;
        multi link friends -> User;
    }
}