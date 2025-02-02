// src/components/CheckATS.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Alert, Button } from "react-bootstrap";
import ReactWordcloud from "react-wordcloud";
import Plot from 'react-plotly.js';
import './CheckATS.css'; // for custom styles

function CheckATS() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Retrieve paths from sessionStorage
    const resumePath = sessionStorage.getItem("resumePath");
    console.log(resumePath);
    const jdPath = sessionStorage.getItem("jdPath");
    console.log(jdPath);
    if (!resumePath || !jdPath) {
      setError("ResumePath or JD_Path not found in sessionStorage.");
      return;
    }

    const fetchAnalysis = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post('http://localhost:5006/api/process', {
          ResumePath: resumePath,
          JD_Path: jdPath
        });

        setAnalysis(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Error processing the resume and job description.");
      }
      setLoading(false);
    };

    fetchAnalysis();
  }, []);

  const generateWordCloudData = (keyterms) => {
    return keyterms.map(([keyword, frequency]) => ({ text: keyword, value: frequency }));
  };

  const generateBarChartData = (keyterms) => {
    const sorted = [...keyterms].sort((a, b) => b[1] - a[1]).slice(0, 20); // top 20
    return {
      x: sorted.map(item => item[0]),
      y: sorted.map(item => item[1]),
      type: 'bar',
      marker: {
        color: sorted.map(item => item[1]),
        colorscale: 'Viridis'
      },
      name: 'Frequency'
    };
  };

  const getScoreColor = (score) => {
    if (score < 60) return "red";
    if (score < 75) return "orange";
    return "green";
  };

  // Word cloud options for better visibility
  const wordCloudOptions = {
    fontSizes: [35, 60], // Min and max font size
    rotations: 2,        // Allow two rotations
    rotationAngles: [-30, 30], // Rotate words between -30 and +30 degrees
    scale: "sqrt",       // Use square root scale to distribute sizes more evenly
    padding: 2,          // Add padding between words
    spiral: "rectangular" // Use rectangular layout for a balanced word cloud
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📄 Resume Matcher</h1>

      {/* Error Message */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Loading Spinner */}
      {loading && <div className="flex justify-center mt-6"><Spinner animation="border" /></div>}

      {/* Analysis Results */}
      {analysis && (
        <div className="mt-8">
          {/* Parsed Resume Data */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">📋 Parsed Resume Data</h2>
            <p className="text-gray-600">This section displays the parsed content from your resume, formatted as it would be interpreted by an ATS (Applicant Tracking System). Use this to understand how your resume is read by automated systems.</p>
            <div className="mt-2 p-4 bg-gray-100 rounded">
              <pre>{analysis.resume.clean_data}</pre>
            </div>
          </section>

          {/* Extracted Keywords from Resume */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">🔑 Extracted Keywords from Resume</h2>
            <p className="text-gray-600">Highlighted keywords are essential terms identified from your resume that match common industry keywords.</p>
            <div className="mt-2 p-4 bg-gray-100 rounded">
              <AnnotatedText content={analysis.resume.clean_data} keywords={analysis.resume.extracted_keywords} label="KW" color="#0B666A" />
            </div>
          </section>

          {/* Word Cloud for Resume Keywords */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">☁️ Word Cloud of Resume Keywords</h2>
            <ReactWordcloud words={generateWordCloudData(analysis.resume.keyterms)} options={wordCloudOptions} />
          </section>

          {/* Bar Chart for Resume Keywords */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">📊 Keyword Frequency in Resume</h2>
            <Plot
              data={[generateBarChartData(analysis.resume.keyterms)]}
              layout={{ title: 'Keyword Frequency in Resume', autosize: true }}
              style={{ width: '100%', height: '400px' }}
              useResizeHandler={true}
            />
          </section>

          {/* Extracted Entities from Resume */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">🏷️ Extracted Entities from Resume</h2>
            {analysis.resume.entities.length > 0 ? (
              <div className="mt-2 p-4 bg-gray-100 rounded">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Entity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.resume.entities.map((entity, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{entity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-gray-600"><strong>Entity Types:</strong> Geopolitical Entities (Locations) and Organizations.</p>
              </div>
            ) : (
              <p>No significant entities found in the resume.</p>
            )}
          </section>

          {/* Parsed Job Description */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">📄 Parsed Job Description</h2>
            <p className="text-gray-600">This section displays the parsed content from the selected job description, formatted as it would be interpreted by an ATS.</p>
            <div className="mt-2 p-4 bg-gray-100 rounded">
              <pre>{analysis.job_description.clean_data}</pre>
            </div>
          </section>

          {/* Extracted Keywords from Job Description */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">🔑 Extracted Keywords from Job Description</h2>
            <p className="text-gray-600">Highlighted keywords are essential terms identified from the job description that your resume should match.</p>
            <div className="mt-2 p-4 bg-gray-100 rounded">
              <AnnotatedText content={analysis.job_description.clean_data} keywords={analysis.job_description.extracted_keywords} label="JD" color="#F24C3D" />
            </div>
          </section>

          {/* Word Cloud for Job Description Keywords */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">☁️ Word Cloud of Job Description Keywords</h2>
            <ReactWordcloud words={generateWordCloudData(analysis.job_description.keyterms)} options={wordCloudOptions} />
          </section>

          {/* Bar Chart for Job Description Keywords */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">📊 Keyword Frequency in Job Description</h2>
            <Plot
              data={[generateBarChartData(analysis.job_description.keyterms)]}
              layout={{ title: 'Keyword Frequency in Job Description', autosize: true }}
              style={{ width: '100%', height: '400px' }}
              useResizeHandler={true}
            />
          </section>

          {/* Extracted Entities from Job Description */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">🏷️ Extracted Entities from Job Description</h2>
            {analysis.job_description.entities.length > 0 ? (
              <div className="mt-2 p-4 bg-gray-100 rounded">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Entity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.job_description.entities.map((entity, index) => (
                      <tr key={index}>
                        <td className="py-2 px-4 border-b">{entity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 text-gray-600"><strong>Entity Types:</strong> Geopolitical Entities (Locations) and Organizations.</p>
              </div>
            ) : (
              <p>No significant entities found in the job description.</p>
            )}
          </section>

          {/* Similarity Score */}
          <section className="mb-6">
            <h2 className="text-2xl font-semibold">📈 Similarity Score</h2>
            <p className="text-gray-600">The similarity score indicates how well your resume matches the selected job description based on extracted keywords.</p>
            <div className="mt-2 p-4 bg-gray-100 rounded flex items-center">
              <span
                style={{
                  color: analysis.score_color,
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginRight: '10px'
                }}
              >
                {analysis.similarity_score}%
              </span>
              <span>{analysis.recommendation}</span>
            </div>
          </section>

          {/* Summary of Findings */}
          <section className="mb-6">
            {analysis.missing_technologies.length > 0 ? (
              <>
                <h2 className="text-2xl font-semibold">🔍 Missing Technologies</h2>
                <div className="mt-2 p-4 bg-gray-100 rounded">
                  <p>These important technologies are present in the job description but missing from your resume. Incorporating them can significantly improve your similarity score.</p>
                  <p className="mt-2">{analysis.missing_technologies.join(", ")}</p>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold">🎉 No Missing Technologies</h2>
                <div className="mt-2 p-4 bg-gray-100 rounded">
                  <p>Your resume contains all the essential technologies from the job description.</p>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

// AnnotatedText Component
function AnnotatedText({ content, keywords, label, color }) {
  // Create a set for quick lookup
  const keywordSet = new Set(keywords.map(kw => kw.toLowerCase()));

  // Simple tokenization: split by whitespace and punctuation
  const tokens = content.split(/(\s+)/);

  // Annotate tokens
  const annotatedDisplay = tokens.map((token, index) => {
    const cleanedToken = token.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,"").toLowerCase();
    if (keywordSet.has(cleanedToken)) {
      return <span key={index} style={{ backgroundColor: color, borderRadius: '3px', padding: '2px 4px', margin: '0 2px' }} title={label}>{token}</span>;
    }
    return <span key={index}>{token}</span>;
  });

  return <p>{annotatedDisplay}</p>;
}

export default CheckATS;
