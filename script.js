// Select elements
const noteArea = document.getElementById('noteArea');
const importFileBtn = document.getElementById('importFileBtn');
const encryptBtn = document.getElementById('encryptBtn');
const decryptBtn = document.getElementById('decryptBtn');
const fileInput = document.getElementById('fileInput');

// Import File Logic
importFileBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        noteArea.value = e.target.result;
    };

    if (file) {
        reader.readAsText(file);
    }
});

// Encrypt Text and Save to File with "Save As" feature using ASCII shift to characters
encryptBtn.addEventListener('click', () => {
    const noteText = noteArea.value;

    if (!noteText) {
        alert('Please write something before encrypting.');
        return;
    }

    // Ask the user for a file name
    const fileName = prompt('Please enter the file name', 'encrypted_note.txt');
    if (!fileName) {
        alert('File name is required!');
        return;
    }

    // Encrypt text by shifting ASCII values +3 and convert to characters
    const encryptedText = encryptToShiftedASCII(noteText, 3);

    // Save the encrypted text to a file
    downloadFile(fileName, encryptedText);

    // Clear the text area after encryption
    noteArea.value = '';
});

// Decrypt Text from Encrypted File
decryptBtn.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const encryptedText = e.target.result;

        try {
            // Decrypt the text by shifting ASCII values -3
            const decryptedText = decryptFromShiftedASCII(encryptedText, 3);

            if (!decryptedText) {
                throw new Error('Failed to decrypt. The file may be corrupted.');
            }

            // Display the decrypted text
            noteArea.value = decryptedText;
        } catch (error) {
            alert('Failed to decrypt. The file may be corrupted.');
        }
    };

    if (file) {
        reader.readAsText(file);
    }
});

// Function to encrypt text by shifting ASCII values and convert to characters
function encryptToShiftedASCII(text, offset) {
    return text.split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) + offset))
        .join('');
}

// Function to decrypt shifted ASCII characters back to original text
function decryptFromShiftedASCII(shiftedText, offset) {
    return shiftedText.split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) - offset))
        .join('');
}

// Function to download text as a file
function downloadFile(filename, content) {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}