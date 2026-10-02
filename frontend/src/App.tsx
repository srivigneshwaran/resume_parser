import { useState } from 'react';
import axios from 'axios';
import './index.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:8000/api/resume/parse", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setParsedData(response.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to parse resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-blue-600 tracking-tight">AI Resume Parser</h1>
          <p className="mt-2 text-lg text-gray-600">Upload your PDF or DOCX resume to instantly extract structured data using NLP.</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-6 max-w-[450px] mx-auto">
          <div className="w-full max-w-md">
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-500">PDF or DOCX (MAX. 5MB)</p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.docx" onChange={handleFileChange} />
            </label>
          </div>
          
          {file && (
            <div className="text-sm font-medium text-gray-700 bg-blue-50 px-4 py-2 rounded-lg">
              Selected: {file.name}
            </div>
          )}

          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className={`mt-4 w-full px-8 py-3 rounded-xl text-white font-semibold shadow-md transition-all ${!file || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5'}`}
          >
            {loading ? 'Parsing Resume...' : 'Parse Resume'}
          </button>
        </div>

        {/* Results Dashboard */}
        {parsedData && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            
            {/* Header Profile */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white">
              <h2 className="text-3xl font-bold">{parsedData.personal_info?.name || 'Unknown Name'}</h2>
              <div className="mt-4 flex flex-wrap gap-4 text-blue-100 text-sm">
                {parsedData.personal_info?.email && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    {parsedData.personal_info.email}
                  </div>
                )}
                {parsedData.personal_info?.phone && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    {parsedData.personal_info.phone}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Column */}
              <div className="md:col-span-1 space-y-12">
                {/* Skills */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Technical Skills</h3>
                  <div className="flex flex-wrap gap-3">
                    {parsedData.skills?.map((skill: str, idx: number) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100">
                        {skill}
                      </span>
                    ))}
                    {(!parsedData.skills || parsedData.skills.length === 0) && <span className="text-gray-400 text-sm">No skills detected</span>}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="md:col-span-2 space-y-12">
                
                {/* Experience */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Experience</h3>
                  <div className="space-y-8">
                    {parsedData.experience?.map((exp: any, idx: number) => (
                      <div key={idx} className="relative pl-6 border-l-2 border-gray-200">
                        <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 border-4 border-white"></div>
                        <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                        <div className="text-blue-600 font-medium text-sm">{exp.company}</div>
                        <div className="text-gray-400 text-sm mt-1 mb-2">{exp.date}</div>
                        {exp.description && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{exp.description}</p>}
                      </div>
                    ))}
                    {(!parsedData.experience || parsedData.experience.length === 0) && <span className="text-gray-400 text-sm">No experience detected</span>}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Education</h3>
                  <div className="space-y-4">
                    {parsedData.education?.map((edu: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                        <div className="text-gray-700 text-sm mt-1">{edu.institution}</div>
                        <div className="text-gray-500 text-xs mt-2 font-medium">{edu.year}</div>
                      </div>
                    ))}
                    {(!parsedData.education || parsedData.education.length === 0) && <span className="text-gray-400 text-sm">No education detected</span>}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
