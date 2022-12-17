import { object, string, date } from "yup";

const schema1 = object().shape({
    TaskHeader: string().trim().required(),
    TaskDesc: string().trim().required(),
    Email: string().email().trim().required(),
    uuid: string().trim().required(),
    CreatedOn: date().default(function () {
        return new Date();
    }),
});

const schema2 = object().shape({
    TaskHeader: string().trim().required(),
    TaskDesc: string().trim().required(),
    uuid: string().trim().required(),
});

async function ValidateFull(obj) {
    return schema1.isValid(obj);
}

async function ValidateUpdate(obj) {
    return schema2.isValid(obj);
}

export { ValidateFull, ValidateUpdate };
