import { object, string, date } from "yup";

const schema1 = object().shape({
    taskheader: string().required(),
    taskdesc: string().required(),
    uuid: string().uuid().required(),
    email: string().email().required(),
    createdOn: date().default(function () {
        return new Date();
    }),
});

const schema2 = object().shape({
    taskheader: string().required(),
    taskdesc: string().required(),
    uuid: string().uuid().required(),
});

async function ValidateFull(obj) {
    return schema1.isValid(obj);
}

async function ValidateUpdate(obj) {
    return schema2.isValid(obj);
}

export { ValidateFull, ValidateUpdate };
