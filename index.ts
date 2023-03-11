import * as readLine from 'readline-sync';
import { db } from './src/firebase'
import { getMonthsSince } from './src/helpers/functions'
import ora from 'ora';


interface profileCustomer {
    keyId: string;
    displayName: string;
    startDate_apiScore: string;
    models: any[];
    mailRoot: string;
    createdAt: string;
    activeCustomer: boolean;
    defaultLang: string;
    companyLogo: string;
    updatedAt: string;
    apiKey: string;
}

interface body {
    customer:string,
    month_year?: string
}


async function generateNewUser(): Promise<void> {
    try {
        console.clear()git remote add origin git@github.com:Cue2g/Shap_control.git
        const client: string = readLine.question("Please enter the model: ").toLowerCase().trim();
        const ref = db.collection('frontEnd').doc('platform_profile-customers').collection('profile-customers').doc('quash_' + client);
        const doc = await ref.get();
        if (!doc.exists) {
            throw new Error('client dont exists');
        }

        const spinner = ora('Loading annual Shap...').start();
        const data = doc.data()! as profileCustomer;
        const arrayMonths = getMonthsSince(data.createdAt);

        const body:body = {
            customer: client
        };

        const option = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
              }
        };
        const yearly = await fetch('http://127.0.0.1:8000/shap/summary_plot', option);


        if(yearly.status != 201){
            spinner.fail('Error creating annual shap');
            throw new Error('Error creating annual shap');
        }

        const annualData = await yearly.json();
        spinner.succeed(`Annaul shap created - Url: ${annualData.url} `);

        for await (const month_year of arrayMonths) {
            const spinnerFor = ora(`Loading ${month_year} Shap`);

            body['month_year'] = month_year;

            const optionsMonth = {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const monthRequest = await fetch('http://127.0.0.1:8000/shap/summary_plot', optionsMonth);

            if (monthRequest.status === 500) {
                spinnerFor.fail(`Error creating annual shap ${month_year}`)
                continue
            };

            if (monthRequest.status === 404) {
                spinnerFor.fail(`Not register in ${month_year}`)
                continue
            };

            const monthData = await monthRequest.json();
            spinnerFor.succeed(`${month_year} shap created - Url: ${monthData.url} `);
        }

    } catch (error) {
        console.error('error')
    }

}

function handleUserInput(userInput: string): void {
    switch (userInput) {
        case "1":
            generateNewUser()
            break;
        default:
            console.log("Invalid Option");
            break;
    }
}

function main(): void {
    console.log("=============== MENU ===============");
    console.log("1. Generate a new Customer");
    console.log("2. Generate all reports")
    const userInput: string = readLine.question("Select an option: ");
    handleUserInput(userInput);
}




main()