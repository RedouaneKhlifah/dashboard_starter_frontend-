
interface IClientForm {
    first_name: string;
    last_name: string; 
    email: string;
    phone: string;
    address: string;
    country: string;
    city: string;
}

interface PartialClientForm extends Partial<IClientForm> {
    general?: string;
}


export type { IClientForm, PartialClientForm };
