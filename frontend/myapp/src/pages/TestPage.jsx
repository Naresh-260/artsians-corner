import { useEffect, useState } from "react";
import axios from "axios";

function TestPage() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      console.log("Testing connection to backend...");
      
      // Test basic connection
      const response = await axios.get("http://localhost:5000/");
      console.log("Basic connection test:", response.data);
      
      // Test login endpoint
      const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
        email: "test@example.com",
        password: "password123"
      });
      console.log("Login test result:", loginResponse.data);
      setTestResult(loginResponse.data);
      
    } catch (error) {
      console.error("Test failed:", error);
      console.error("Error details:", error.response?.data);
      setTestResult({ error: error.message, details: error.response?.data });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h3>Connection Test</h3>
          <button 
            className="btn btn-primary mb-3" 
            onClick={testConnection}
            disabled={loading}
          >
            {loading ? "Testing..." : "Test Connection"}
          </button>
          
          {testResult && (
            <div className="mt-3">
              <h5>Test Result:</h5>
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestPage;