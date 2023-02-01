module default {
    type User {
        required property username -> str;
        required property password -> str;
        required property email -> str;
        multi link friends -> User;
    }
}