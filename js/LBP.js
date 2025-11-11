document.addEventListener('DOMContentLoaded', () => {
    // Set the current date automatically on load
    document.getElementById('date').valueAsDate = new Date();
});

document.getElementById('assessmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = {};

    // 1. General Form Fields (Simple Key-Value Pairs)
    formData.forEach((value, key) => {
        // Ignore radio/checkboxes initially to handle them as arrays
        if (key.includes('loss-') || key.includes('symptoms-') || key.includes('worse') || key.includes('better')) {
            return; 
        }
        data[key] = value;
    });

    // 2. Process Movement Loss Table
    const movements = ["Flexion", "Extension", "SideGlidingR", "SideGlidingL"];
    data.movementLoss = movements.map(movement => {
        const lossKey = 'loss-' + movement;
        // The symptom key uses the data-type attribute for selection
        const symptomElement = form.querySelector(`input[data-type="symptoms-${movement}"]`);
        
        const lossValue = formData.get(lossKey) || null;
        const symptomValue = symptomElement ? symptomElement.value : '';

        return {
            movement: movement,
            degree: lossValue,
            symptoms: symptomValue
        };
    });
    
    // 3. Process Checkboxes for Worse/Better
    data.symptomModifiers = {
        worseWith: [],
        betterWith: []
    };

    const worseCheckboxes = form.querySelectorAll('input[name^="worse"]:checked');
    worseCheckboxes.forEach(cb => data.symptomModifiers.worseWith.push(cb.value));

    const betterCheckboxes = form.querySelectorAll('input[name^="better"]:checked');
    betterCheckboxes.forEach(cb => data.symptomModifiers.betterWith.push(cb.value));


    // 4. Final Classification and Management (Ensuring single values are captured and structured)
    data.classification = {
        primary: formData.get('primaryClassification') || null,
        derangementType: formData.get('derangementType') || null,
        directionalPreference: formData.get('directionalPreference') || '',
        comorbidities: formData.get('comorbidities') || '',
        cognitiveEmotional: formData.get('cognitiveEmotional') || '',
        contextualFactors: formData.get('contextualFactors') || ''
    };
    
    data.management = {
        exerciseType: formData.get('exerciseType') || '',
        frequency: formData.get('frequency') || '',
        managementGoals: formData.get('managementGoals') || '',
        otherInterventions: formData.get('otherInterventions') || ''
    };
    
    // The signature field is captured with the general fields, we can move it to a structure if preferred, but for now we'll ensure cleanup works.

    // 5. Clean up the final object to remove redundant keys that were processed into structured objects
    const keysToDelete = [
        // All individual keys that are now grouped into structured objects
        'primaryClassification', 'derangementType', 'directionalPreference', 'comorbidities', 
        'cognitiveEmotional', 'contextualFactors', 'exerciseType', 'frequency', 
        'managementGoals', 'otherInterventions'
    ];
    
    for (const key of Object.keys(data)) {
        if (keysToDelete.includes(key) || key.includes('loss-') || key.includes('symptoms-') || key.includes('worse') || key.includes('better')) {
            delete data[key];
        }
    }


    // Final Output (Simulates sending data to a server)
    const finalJson = JSON.stringify(data, null, 2);
    console.log("--- START ASSESSMENT DATA JSON ---");
    console.log(finalJson);
    console.log("--- END ASSESSMENT DATA JSON ---");
    
    // Display confirmation message
    document.getElementById('outputMessage').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('outputMessage').classList.add('hidden');
    }, 5000);
});
