import wixData from 'wix-data';
import { getCVEData } from 'backend/nistAPI';

$w.onReady(function () {
    $w("#detectButton").onClick(() => {
        let logs = $w("#logInput").value;
        if (!logs) {
            $w("#resultText").text = "Please enter log details.";
            return;
        }

        let detectedIntrusions = analyzeLogs(logs);
        let attackTypes = detectedIntrusions.map(item => item.type);

        if (attackTypes.length > 0) {
            getCVEData(attackTypes.join(" ")).then(cveData => {
                $w("#resultText").text = `Intrusions Detected: ${attackTypes.join(", ")}\n`;
                cveData.forEach(cve => {
                    $w("#resultText").text += `\n${cve.id}: ${cve.description}`;
                });
            });
        } else {
            $w("#resultText").text = "No threats detected.";
        }
    });
});

function analyzeLogs(logs) {
    let threats = [];
    
    if (logs.includes("Failed password")) {
        threats.push({ type: "SSH Brute Force", severity: "High" });
    }
    if (logs.includes("SQL syntax")) {
        threats.push({ type: "SQL Injection", severity: "Critical" });
    }
    if (logs.includes("192.168.1.")) {
        threats.push({ type: "Local Network Scan", severity: "Medium" });
    }

    return threats;
}
