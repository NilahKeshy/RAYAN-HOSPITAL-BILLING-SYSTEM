// Service rates
const serviceRates = {
    'Consultation': 500,
    'Room Charges': 2000,
    'Lab Tests': 1500,
    'X-Ray': 800,
    'Ultrasound': 1200,
    'Surgery': 5000,
    'Medication': 3000,
    'Nursing Care': 1000
};

// Calculate Bill Function
function calculateBill() {
    // Get patient information
    const patientName = document.getElementById('patientName').value.trim();
    const patientId = document.getElementById('patientId').value.trim();
    const patientAge = document.getElementById('patientAge').value;
    const patientPhone = document.getElementById('patientPhone').value.trim();
    const admissionDate = document.getElementById('admissionDate').value;

    // Validate required fields
    if (!patientName || !patientId || !patientAge || !patientPhone || !admissionDate) {
        alert('Please fill in all patient information fields');
        return;
    }

    // Get selected services
    const selectedServices = getSelectedServices();

    if (selectedServices.length === 0) {
        alert('Please select at least one service');
        return;
    }

    // Calculate totals
    const { subTotal, discount, total } = calculateTotals(selectedServices);

    // Update invoice display
    updateInvoiceDisplay(patientName, patientId, patientAge, patientPhone, admissionDate, selectedServices, subTotal, discount, total);

    // Show success message
    alert('Bill calculated successfully!');
}

// Get Selected Services Function
function getSelectedServices() {
    const checkboxes = document.querySelectorAll('.service-checkbox:checked');
    const selectedServices = [];

    checkboxes.forEach(checkbox => {
        const service = checkbox.getAttribute('data-service');
        let price = parseFloat(checkbox.getAttribute('data-price'));
        let quantity = 1;

        // Handle room and nursing days
        if (service === 'Room Charges') {
            quantity = parseInt(document.getElementById('roomDays').value) || 1;
            price = price * quantity;
        } else if (service === 'Nursing Care') {
            quantity = parseInt(document.getElementById('nursingDays').value) || 1;
            price = price * quantity;
        }

        selectedServices.push({
            service: service,
            price: price / quantity,
            quantity: quantity,
            amount: price
        });
    });

    return selectedServices;
}

// Calculate Totals Function
function calculateTotals(selectedServices) {
    let subTotal = 0;

    selectedServices.forEach(item => {
        subTotal += item.amount;
    });

    const discountPercent = parseFloat(document.getElementById('discountPercent').value) || 0;
    const discount = (subTotal * discountPercent) / 100;
    const total = subTotal - discount;

    return {
        subTotal: subTotal,
        discount: discount,
        total: total
    };
}

// Update Invoice Display Function
function updateInvoiceDisplay(patientName, patientId, patientAge, patientPhone, admissionDate, selectedServices, subTotal, discount, total) {
    // Update patient information
    document.getElementById('invPatientName').textContent = patientName;
    document.getElementById('invPatientId').textContent = patientId;
    document.getElementById('invPatientAge').textContent = patientAge;
    document.getElementById('invPatientPhone').textContent = patientPhone;
    document.getElementById('invAdmissionDate').textContent = admissionDate;

    // Update services table
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '';

    selectedServices.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.service}</td>
            <td>${item.quantity}</td>
            <td>Rs. ${item.price.toFixed(2)}</td>
            <td>Rs. ${item.amount.toFixed(2)}</td>
        `;
        servicesList.appendChild(row);
    });

    // Update totals
    document.getElementById('subTotal').textContent = 'Rs. ' + subTotal.toFixed(2);
    document.getElementById('discountAmount').textContent = 'Rs. ' + discount.toFixed(2);
    document.getElementById('totalAmount').textContent = 'Rs. ' + total.toFixed(2);

    // Update date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('invoiceDate').textContent = dateStr;
}

// Generate Invoice Function
function generateInvoice() {
    const patientName = document.getElementById('patientName').value.trim();

    if (!patientName) {
        alert('Please calculate the bill first!');
        return;
    }

    alert('Invoice generated successfully for ' + patientName + '!

You can now print or save it.');
}

// Print Invoice Function
function printInvoice() {
    const patientName = document.getElementById('invPatientName').textContent;

    if (patientName === '-') {
        alert('Please calculate the bill first before printing!');
        return;
    }

    window.print();
}

// Reset Form Function
function resetForm() {
    // Clear patient information
    document.getElementById('patientName').value = '';
    document.getElementById('patientId').value = '';
    document.getElementById('patientAge').value = '';
    document.getElementById('patientPhone').value = '';
    document.getElementById('admissionDate').value = '';

    // Uncheck all services
    const checkboxes = document.querySelectorAll('.service-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset quantities
    document.getElementById('roomDays').value = 1;
    document.getElementById('nursingDays').value = 1;
    document.getElementById('discountPercent').value = 0;

    // Clear invoice display
    const servicesList = document.getElementById('servicesList');
    servicesList.innerHTML = '<tr><td colspan="4" class="empty-message">No services selected</td></tr>';

    document.getElementById('invPatientName').textContent = '-';
    document.getElementById('invPatientId').textContent = '-';
    document.getElementById('invPatientAge').textContent = '-';
    document.getElementById('invPatientPhone').textContent = '-';
    document.getElementById('invAdmissionDate').textContent = '-';
    document.getElementById('subTotal').textContent = 'Rs. 0.00';
    document.getElementById('discountAmount').textContent = 'Rs. 0.00';
    document.getElementById('totalAmount').textContent = 'Rs. 0.00';
    document.getElementById('invoiceDate').textContent = '-';

    alert('Form reset successfully!');
}

// Allow Enter key to calculate bill
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="tel"], input[type="date"]');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateBill();
            }
        });
    });

    // Real-time calculation when discount changes
    document.getElementById('discountPercent').addEventListener('change', function() {
        const selectedServices = getSelectedServices();
        if (selectedServices.length > 0) {
            const { subTotal, discount, total } = calculateTotals(selectedServices);
            document.getElementById('discountAmount').textContent = 'Rs. ' + discount.toFixed(2);
            document.getElementById('totalAmount').textContent = 'Rs. ' + total.toFixed(2);
        }
    });

    // Update totals when room/nursing days change
    document.getElementById('roomDays').addEventListener('change', recalculateOnChange);
    document.getElementById('nursingDays').addEventListener('change', recalculateOnChange);
});

// Recalculate on input change
function recalculateOnChange() {
    const selectedServices = getSelectedServices();
    if (selectedServices.length > 0) {
        const { subTotal, discount, total } = calculateTotals(selectedServices);
        updateInvoiceDisplay(
            document.getElementById('invPatientName').textContent,
            document.getElementById('invPatientId').textContent,
            document.getElementById('invPatientAge').textContent,
            document.getElementById('invPatientPhone').textContent,
            document.getElementById('invAdmissionDate').textContent,
            selectedServices,
            subTotal,
            discount,
            total
        );
    }
}