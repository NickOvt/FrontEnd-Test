/* Get form, form values and calculate totals based on input values
   with error checking */

let calculatorForm = document.querySelector(".calculator-form");

calculatorForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent webpage from reloading

    // Check if input is a number and not empty
    let checkIfNumberRegex = /^[0-9]+$/;

    // Get input field values
    let euroInput = document.querySelector(".input-euro").value;
    let daysInput = document.querySelector(".input-days").value;
    let tuberculosisInput = document.querySelector(".input-checkbox").checked;

    // Get output fields
    let employerDaysOutput = document.querySelector(".form-employer-days");
    let insuranceDaysOutput = document.querySelector(".form-health-days");
    let dailyAllowanceOutput = document.querySelectorAll(".form-daily-allowance-value");
    let employerTotalOutput = document.querySelector(".form-employer-total-value");
    let insuranceTotalOutput = document.querySelector(".form-health-total-value");
    let totalOutput = document.querySelector(".form-total-value");
    let totalDaysOutput = document.querySelector(".form-total-days");

    // Check if inputs are indeed numbers
    if(euroInput.match(checkIfNumberRegex) && daysInput.match(checkIfNumberRegex)) {
        // Get output object based on func parameters
        const formOutput = calc(euroInput, daysInput, tuberculosisInput);

        // Check if no error
        if(formOutput !== "") {
            // Output data in form
            employerDaysOutput.textContent = formOutput.employerDays;
            insuranceDaysOutput.textContent = formOutput.insuranceDays;

            dailyAllowanceOutput.forEach(el => {
                el.textContent = formatToEE(formOutput.dailyAllowance);
            });

            employerTotalOutput.textContent = formatToEE(formOutput.employerComp);
            insuranceTotalOutput.textContent = formatToEE(formOutput.insuranceComp);
            totalOutput.textContent = formatToEE(formOutput.total);

            totalDaysOutput.textContent = daysInput;
        }
    } else {
        alert("Input is not a number!");
    }
});

// Main calculate function
// Inputs: (int) Average income, (int) days of sick-leave, (bool) isTuberculosis
function calc(income, days, isTuberculosis) {
    let compensation = 0.7 * income; // Compensation is 70% of income
    let dailyAllowance = (compensation / 30) * 0.8; // There are 30 days in bank month and 20% is the income tax(100% - 20% = 80% = 0.8)

    let total = 0; // Compensation total
    let employerDays = 0; // Amount of employer compensated days
    let insuranceDays = 0; // Amount of Health Insurance compensated days
    let employerComp = 0;  // Compensation by employer (euros)
    let insuranceComp = 0; // Compensation by insurance (euros)

    const maxEventLength = isTuberculosis ? 240 : 182; // Max Event length based on either the user has or has not tuberculosis

    // Event can't be bigger than max
    if(days > maxEventLength) {
        alert("Days can't be bigger than max allowed!");
        return "";
    }

    // Get employer and insurance days
    if(days < 4) {
        total = 0;
    }
    else if (days >= 4 && days <= 8) {
        employerDays = days - 3;
    }
    else if (days > 8) {
        insuranceDays = days - 8;
        employerDays = 5;
    }

    // Calculate totals
    employerComp = employerDays * dailyAllowance;
    insuranceComp = insuranceDays * dailyAllowance;

    total = (employerDays + insuranceDays) * dailyAllowance;

    // Return object of data (if all checks passed)
    return {
        dailyAllowance,
        employerDays,
        employerComp,
        insuranceDays,
        insuranceComp,
        total,
    };
}

// Format the data to Estonian standards
// Input: (int) Numeric input
function formatToEE(input)  {
    return input.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/\./g, "");
}
