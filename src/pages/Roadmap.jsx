import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, { 
  Background, 
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FiDownload, FiShare2, FiSave, FiCheck, FiArrowRight } from 'react-icons/fi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const Roadmap = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [domain, setDomain] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useNodesState([]);
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roadmapResponse, setRoadmapResponse] = useState(null);
  const reactFlowWrapper = useRef(null);

  const domains = [
    {
      name: 'Software Development',
      description: 'Learn programming fundamentals, algorithms, and software engineering practices'
    },
    {
      name: 'AI/Machine Learning',
      description: 'Master machine learning algorithms, deep learning, and AI applications'
    },
    {
      name: 'Data Science',
      description: 'Learn data analysis, statistics, and data visualization'
    },
    {
      name: 'Web Development',
      description: 'Master frontend and backend technologies for web applications'
    },
    {
      name: 'Mobile Development',
      description: 'Build iOS and Android applications using modern frameworks'
    },
    {
      name: 'DevOps',
      description: 'Learn cloud computing, CI/CD, and infrastructure automation'
    },
    {
      name: 'Cybersecurity',
      description: 'Master network security, ethical hacking, and security best practices'
    },
    {
      name: 'Other',
      description: 'Specify your own learning domain'
    }
  ];

  const renderNodeContent = useCallback((nodeId, stepTitle, tasks, index, isCompleted) => (
    <div 
      className={`bg-white dark:bg-gray-800 p-10 rounded-xl shadow-xl border transition-all duration-300 ${
        isCompleted 
          ? 'border-green-500 dark:border-green-400 border-4' 
          : 'border-gray-200 dark:border-gray-700 border-2'
      } max-w-[550px] cursor-pointer hover:shadow-2xl transform hover:scale-105`}
      onClick={() => toggleNodeCompletion(nodeId)}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <span className="text-indigo-600 dark:text-indigo-400 text-2xl font-bold">{index + 1}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stepTitle}</h3>
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isCompleted
            ? 'bg-green-500 scale-110'
            : 'bg-gray-200 dark:bg-gray-700'
        }`}>
          {isCompleted && (
            <FiCheck className="text-white w-8 h-8" />
          )}
        </div>
      </div>
      <ul className="text-lg text-gray-600 dark:text-gray-300 space-y-3">
        {tasks.map((task, taskIndex) => (
          <li key={taskIndex} className="list-disc ml-6">
            <a 
              href={task.resource} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {task.topic}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ), []);

  const toggleNodeCompletion = useCallback((nodeId) => {
    setCompletedNodes((prev) => {
      const isCurrentlyCompleted = prev.has(nodeId);
      const newCompleted = new Set(prev);
      
      if (isCurrentlyCompleted) {
        newCompleted.delete(nodeId);
      } else {
        newCompleted.add(nodeId);
      }

      // Update node appearance
      setNodes((nds) => {
        return nds.map((node) => {
          if (node.id === nodeId) {
            // Find the node index to pass to renderNodeContent
            const index = parseInt(node.id.split('-')[1]);
            return {
              ...node,
              data: {
                ...node.data,
                label: renderNodeContent(
                  node.id,
                  node.data.title,
                  node.data.tasks,
                  index,
                  !isCurrentlyCompleted // Use the opposite of current completion state
                )
              }
            };
          }
          return node;
        });
      });

      // Update edge colors
      setEdges((eds) => {
        return eds.map((edge) => {
          if (edge.source === nodeId) {
            return {
              ...edge,
              style: {
                ...edge.style,
                stroke: !isCurrentlyCompleted ? '#22C55E' : '#4F46E5' // Use the opposite of current completion state
              }
            };
          }
          return edge;
        });
      });

      return newCompleted;
    });
  }, [setNodes, setEdges]);

  const memoizedRenderNodeContent = useCallback((nodeId, stepTitle, tasks, index, isCompleted) => {
    return renderNodeContent(nodeId, stepTitle, tasks, index, isCompleted);
  }, [renderNodeContent]);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const calculateProgress = useCallback(() => {
    if (!nodes.length) return 0;
    return Math.round((completedNodes.size / nodes.length) * 100);
  }, [nodes.length, completedNodes.size]);

  const convertRoadmapToNodes = (roadmapData) => {
    console.log('Converting roadmap data:', roadmapData);
    
    const nodes = [];
    const edges = [];
    const stepWidth = 600;
    const stepHeight = 300;
    const horizontalGap = 300;
    const verticalGap = 600;

    roadmapData.steps.forEach((step, index) => {
      console.log(`Processing step ${index}:`, step);
      
      const nodeId = `step-${index}`;
      let x = 0;
      let y = 0;

      const section = Math.floor(index / 2);
      const isEvenSection = section % 2 === 0;
      const isFirstInSection = index % 2 === 0;

      x = section * (stepWidth + horizontalGap);
      
      if (isEvenSection) {
        y = isFirstInSection ? 0 : verticalGap;
      } else {
        y = isFirstInSection ? verticalGap : 0;
      }

      const node = {
        id: nodeId,
        position: { x, y },
        data: {
          title: step.title,
          tasks: step.tasks,
          label: memoizedRenderNodeContent(nodeId, step.title, step.tasks, index, completedNodes.has(nodeId))
        },
        style: {
          width: stepWidth,
          background: 'transparent',
          border: 'none'
        }
      };

      console.log(`Created node ${index}:`, node);
      nodes.push(node);

      if (index < roadmapData.steps.length - 1) {
        const edge = {
          id: `edge-${index}`,
          source: nodeId,
          target: `step-${index + 1}`,
          type: 'smoothstep',
          animated: true,
          style: { 
            stroke: completedNodes.has(nodeId) ? '#22C55E' : '#4F46E5',
            strokeWidth: 6
          }
        };
        edges.push(edge);
      }
    });

    console.log('Final nodes:', nodes);
    console.log('Final edges:', edges);
    return { nodes, edges };
  };

  const loadSavedRoadmap = async (roadmapId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5001/api/roadmaps/${roadmapId}`);
      if (!response.ok) {
        throw new Error('Failed to load roadmap');
      }

      const savedRoadmap = await response.json();
      console.log('Loaded roadmap:', savedRoadmap);

      setDomain(savedRoadmap.domain);
      setRoadmapResponse(savedRoadmap.geminiResponse);

      // Convert the saved nodes back to the proper format with React components
      const convertedNodes = savedRoadmap.nodes.map((node, index) => ({
        ...node,
        data: {
          ...node.data,
          label: memoizedRenderNodeContent(
            node.id,
            node.data.title,
            node.data.tasks,
            index,
            savedRoadmap.completedNodes.includes(node.id)
          )
        },
        style: {
          width: 600,
          background: 'transparent',
          border: 'none'
        }
      }));

      setNodes(convertedNodes);
      setEdges(savedRoadmap.edges.map(edge => ({
        ...edge,
        animated: true,
        style: { 
          stroke: savedRoadmap.completedNodes.includes(edge.source) ? '#22C55E' : '#4F46E5',
          strokeWidth: 6
        },
        type: 'smoothstep'
      })));
      setCompletedNodes(new Set(savedRoadmap.completedNodes));

      console.log('Roadmap loaded successfully:', {
        nodes: convertedNodes,
        edges: savedRoadmap.edges,
        completedNodes: savedRoadmap.completedNodes
      });
    } catch (error) {
      console.error('Error loading roadmap:', error);
      setError('Failed to load roadmap');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    const selectedDomain = showCustomDomain ? customDomain : domain;
    
    if (!selectedDomain) {
      setError('Please select or enter a domain');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const prompt = `Create a comprehensive and detailed learning roadmap for ${selectedDomain}${additionalInfo ? ` with focus on ${additionalInfo}` : ''}. Follow these guidelines:
      1. Structure the response in this exact JSON format without any additional text or line breaks within values:
      {
        "title": "${selectedDomain} Learning Roadmap",
        "steps": [
          {
            "title": "step title",
            "tasks": [
              {
                "topic": "Topic Name with brief description",
                "resource": "https://example.com/resource"
              }
            ]
          }
        ]
      }

      Guidelines for content:
      1. Include 6-8 detailed steps, ordered from fundamentals to advanced concepts
      2. Each step should have 3-4 tasks with specific topics and high-quality learning resources
      3. For each topic, include a brief description in the same line
      4. Resources must be valid URLs starting with http:// or https://
      5. Resources should include a mix of:
         - Official documentation
         - Interactive tutorials
         - Video courses (free)
         - Practice exercises
      6. Focus on modern tools, frameworks, and industry best practices
      7. Include practical projects and hands-on exercises
      8. Ensure progressive difficulty from step to step
      9. IMPORTANT: Return ONLY the JSON object, no additional text or explanations
      10. Make sure each step builds upon previous knowledge
      11. Keep all text content in single lines without line breaks`;

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAQw8XVYRNfq0VpXfqnbNpJCRcD8evJ_7E',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to generate roadmap: ${response.status}`);
      }

      const data = await response.json();
      setRoadmapResponse(data);
      
      try {
        const textContent = data.candidates[0].content.parts[0].text.trim();
        console.log('Gemini Text Response:', textContent);
        
        // Try to find JSON content, handling potential leading/trailing text
        let jsonContent = textContent;
        const jsonStartIndex = textContent.indexOf('{');
        const jsonEndIndex = textContent.lastIndexOf('}');
        
        if (jsonStartIndex === -1 || jsonEndIndex === -1) {
          console.error('No JSON object found in response');
          throw new Error('Invalid response format: No JSON object found');
        }
        
        jsonContent = textContent.substring(jsonStartIndex, jsonEndIndex + 1);
        console.log('Extracted JSON content:', jsonContent);
        
        // Try to clean up common JSON formatting issues
        jsonContent = jsonContent
          .replace(/\n/g, ' ')  // Remove newlines
          .replace(/\s+/g, ' ') // Normalize whitespace
          .replace(/,\s*}/g, '}') // Remove trailing commas
          .replace(/,\s*]/g, ']') // Remove trailing commas in arrays
          .replace(/\\"/g, '"') // Fix escaped quotes
          .replace(/\\\\/g, '\\'); // Fix double escaped backslashes
        
        let roadmapData;
        try {
          roadmapData = JSON.parse(jsonContent);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Problematic JSON:', jsonContent);
          throw new Error(`JSON parsing failed: ${parseError.message}`);
        }
        
        // Validate the roadmap data structure
        if (!roadmapData.title || !Array.isArray(roadmapData.steps)) {
          console.error('Invalid roadmap structure:', roadmapData);
          throw new Error('Invalid roadmap data structure: missing title or steps');
        }
        
        // Validate each step and task
        roadmapData.steps.forEach((step, stepIndex) => {
          if (!step.title || !Array.isArray(step.tasks)) {
            console.error(`Invalid step at index ${stepIndex}:`, step);
            throw new Error(`Invalid step structure at position ${stepIndex + 1}`);
          }
          
          step.tasks.forEach((task, taskIndex) => {
            if (!task.topic || !task.resource) {
              console.error(`Invalid task at step ${stepIndex}, task ${taskIndex}:`, task);
              throw new Error(`Invalid task structure at step ${stepIndex + 1}, task ${taskIndex + 1}`);
            }
          });
        });
        
        console.log('Validated Roadmap Data:', roadmapData);
        
        const { nodes: newNodes, edges: newEdges } = convertRoadmapToNodes(roadmapData);
        console.log('Converted Nodes:', newNodes);
        
        setNodes(newNodes);
        setEdges(newEdges);
      } catch (parseError) {
        console.error('Failed to parse roadmap data:', parseError);
        throw new Error(`Failed to process roadmap data: ${parseError.message}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = () => {
    if (!nodes.length) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const maxWidth = pageWidth - (2 * margin);
    let y = margin;

    // Helper function to handle text wrapping and return the height used
    const addWrappedText = (text, x, y, maxWidth, font = 'normal') => {
      pdf.setFont('helvetica', font);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return lines.length * pdf.getTextDimensions('Test').h;
    };

    // Add title
    pdf.setFontSize(12);
    const title = `${domain.toUpperCase()} LEARNING ROADMAP`;
    const titleWidth = pdf.getStringUnitWidth(title) * 12 / pdf.internal.scaleFactor;
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, (pageWidth - titleWidth) / 2, y);
    y += 15; // Increased spacing after title since we removed the date

    // Add steps
    nodes.forEach((node, index) => {
      // Check if we need a new page
      if (y > pageHeight - margin) {
        pdf.addPage();
        y = margin;
      }

      // Add step number and title
      pdf.setFont('helvetica', 'bold');
      const stepTitle = `${index + 1}. ${node.data.label.props.children[0].props.children[1].props.children[1].props.children}`;
      const titleHeight = addWrappedText(stepTitle, margin, y, maxWidth, 'bold');
      y += titleHeight + 5;

      // Add tasks
      node.data.label.props.children[0].props.children[2].props.children.forEach(task => {
        // Check if we need a new page
        if (y > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }

        const bulletPoint = '• ';
        const bulletWidth = pdf.getStringUnitWidth(bulletPoint) * 12 / pdf.internal.scaleFactor;
        
        // Add bullet point
        pdf.setFont('helvetica', 'normal');
        pdf.text(bulletPoint, margin, y);
        
        // Add wrapped task text
        const taskMaxWidth = maxWidth - bulletWidth;
        const taskHeight = addWrappedText(task.props.children, margin + bulletWidth, y, taskMaxWidth);
        y += taskHeight + 3;
      });

      y += 8; // Add space between steps
    });

    // Save the PDF
    pdf.save(`${domain.toLowerCase()}-roadmap-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const shareRoadmap = () => {
    // Create a shareable object with all necessary data
    const shareableData = {
      domain: showCustomDomain ? customDomain : domain,
      nodes,
      edges,
      completedNodes: Array.from(completedNodes)
    };

    // Convert to base64 to make it URL-safe
    const encodedData = btoa(JSON.stringify(shareableData));
    const url = `${window.location.origin}/roadmap/shared/${encodedData}`;
    setShareUrl(url);

    // Try using the native share API if available
    if (navigator.share) {
      navigator.share({
        title: `${shareableData.domain} Learning Roadmap`,
        text: 'Check out this learning roadmap I created!',
        url: url
      }).catch((err) => {
        console.log('Error sharing:', err);
        // Fallback to modal if sharing fails
        setShowShareModal(true);
      });
    } else {
      // If native sharing is not available, show the modal
      setShowShareModal(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSaveRoadmap = async () => {
    try {
      setSaving(true);
      
      const roadmapData = {
        userId: 'temp-user-id', // Replace with actual user ID
        domain: showCustomDomain ? customDomain : domain,
        nodes: nodes,
        edges: edges,
        completedNodes: Array.from(completedNodes),
        progress: calculateProgress(),
        geminiResponse: roadmapResponse // Store the original Gemini response
      };

      const response = await fetch('http://localhost:5001/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmapData),
      });

      if (!response.ok) {
        throw new Error('Failed to save roadmap');
      }

      toast.success('Roadmap saved successfully!');
    } catch (error) {
      console.error('Error saving roadmap:', error);
      toast.error('Failed to save roadmap');
    } finally {
      setSaving(false);
    }
  };

  const saveRoadmap = async () => {
    try {
      console.log('Starting roadmap save...');
      
      if (!roadmapResponse) {
        throw new Error('No roadmap data available to save');
      }

      // Parse the Gemini response once
      const textContent = roadmapResponse.candidates[0].content.parts[0].text;
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }
      
      const parsedRoadmap = JSON.parse(jsonMatch[0]);
      console.log('Parsed Roadmap:', parsedRoadmap);

      // Extract the raw data from nodes before saving
      const serializedNodes = nodes.map((node, index) => {
        const step = parsedRoadmap.steps[index];
        console.log(`Processing node ${index}:`, step);

        return {
          id: node.id,
          position: node.position,
          data: {
            title: step.title,
            tasks: step.tasks.map(task => ({
              topic: task.topic,
              resource: task.resource
            }))
          }
        };
      });

      console.log('Serialized Nodes:', serializedNodes);
      
      // Create a clean version of the Gemini response
      const cleanGeminiResponse = {
        candidates: [{
          content: {
            parts: [{
              text: jsonMatch[0] // Only keep the JSON part
            }]
          }
        }]
      };

      const roadmapData = {
        domain,
        nodes: serializedNodes,
        edges,
        completedNodes: Array.from(completedNodes),
        progress: calculateProgress(),
        geminiResponse: cleanGeminiResponse
      };

      console.log('Sending roadmap data to server...');
      const response = await fetch('http://localhost:5001/api/roadmaps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roadmapData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save roadmap');
      }

      const savedRoadmap = await response.json();
      console.log('Roadmap saved successfully:', savedRoadmap);
      toast.success('Roadmap saved successfully!');
      navigate('/saved-roadmaps');
    } catch (error) {
      console.error('Error saving roadmap:', error);
      toast.error(error.message || 'Failed to save roadmap');
    }
  };

  const generateRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);

      const prompt = `Create a comprehensive and detailed learning roadmap for ${domain}${additionalInfo ? ` with focus on ${additionalInfo}` : ''}. Follow these guidelines:
      1. Structure the response in this exact JSON format:
      {
        "title": "${domain} Learning Roadmap",
        "steps": [
          {
            "title": "step title",
            "tasks": [
              {
                "topic": "Topic Name - include brief description (1-2 lines)",
                "resource": "URL to learning resource"
              }
            ]
          }
        ]
      }

      Guidelines for content:
      1. Include 8-12 detailed steps, ordered from fundamentals to advanced concepts
      2. Each step should have 4-6 tasks with specific topics and high-quality learning resources
      3. For each topic, include a brief description (1-2 lines) explaining what will be learned
      4. Resources should include a mix of:
         - Official documentation
         - Interactive tutorials
         - Video courses (free)
         - Practice exercises
         - Project-based learning resources
      5. Focus on modern tools, frameworks, and industry best practices
      6. Include practical projects and hands-on exercises for each major concept
      7. Ensure progressive difficulty from step to step
      8. Only include working URLs to legitimate learning resources (documentation, tutorials, courses)
      9. IMPORTANT: Return ONLY the JSON object, no additional text or explanations
      10. Make sure each step builds upon previous knowledge
      11. Include both theoretical concepts and practical implementation`;

      const response = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyAQw8XVYRNfq0VpXfqnbNpJCRcD8evJ_7E',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to generate roadmap: ${response.status}`);
      }

      const data = await response.json();
      
      try {
        const textContent = data.candidates[0].content.parts[0].text;
        const jsonMatch = textContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const roadmapData = JSON.parse(jsonMatch[0]);
          console.log('Parsed Roadmap Data:', roadmapData);
          
          const { nodes: newNodes, edges: newEdges } = convertRoadmapToNodes(roadmapData);
          console.log('Converted Nodes:', newNodes);
          
          setNodes(newNodes);
          setEdges(newEdges);
        } else {
          throw new Error('No valid JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse roadmap data:', parseError);
        throw new Error('Failed to process roadmap data');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to generate roadmap. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const saveChanges = async () => {
    if (!id) return;

    try {
      setSaving(true);
      console.log('Saving changes for roadmap:', id);

      // Create a sanitized version of nodes without React components
      const sanitizedNodes = nodes.map(node => ({
        ...node,
        data: {
          title: node.data.title,
          tasks: node.data.tasks
        }
      }));

      // Create a sanitized version of edges
      const sanitizedEdges = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type,
        style: {
          stroke: edge.style?.stroke || '#4F46E5',
          strokeWidth: edge.style?.strokeWidth || 6
        }
      }));

      // Remove any trailing dots from the ID
      const cleanId = id.replace(/\.$/, '');
      const response = await fetch(`http://localhost:5001/api/roadmaps/${cleanId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          nodes: sanitizedNodes,
          edges: sanitizedEdges,
          completedNodes: Array.from(completedNodes),
          progress: calculateProgress(),
          geminiResponse: roadmapResponse
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Server response:', errorData);
        throw new Error(errorData?.error || 'Failed to save changes');
      }

      const updatedRoadmap = await response.json();
      console.log('Changes saved successfully:', updatedRoadmap);
      toast.success('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error(error.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadSavedRoadmap(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate('/saved-roadmaps')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Saved Roadmaps
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {!nodes.length ? (
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
                >
                  <svg 
                    stroke="currentColor" 
                    fill="none" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-6 h-6 text-gray-900 dark:text-white" 
                    height="1em" 
                    width="1em" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </button>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Generate Your Learning Roadmap</h2>
              </div>
              
              <div className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <label className="block text-base font-semibold text-gray-700 dark:text-gray-300">
                      Select Learning Domain
                    </label>
                    <select
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all"
                      value={domain}
                      onChange={(e) => {
                        setDomain(e.target.value);
                        setShowCustomDomain(e.target.value === 'Other');
                      }}
                    >
                      <option value="">Select a domain</option>
                      {domains.map((d) => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                    {domain && !showCustomDomain && (
                      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                          {domains.find(d => d.name === domain)?.description}
                        </p>
                      </div>
                    )}
                  </div>

                  {showCustomDomain ? (
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 dark:text-gray-300">
                        Enter Custom Domain
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                        placeholder="Enter your custom domain"
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="block text-base font-semibold text-gray-700 dark:text-gray-300">
                        Additional Information (Optional)
                      </label>
                      <textarea
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 transition-all resize-none"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder="Add any specific areas or skills you want to focus on..."
                        rows={4}
                      />
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerateRoadmap}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generating...
                    </span>
                  ) : (
                    'Generate Roadmap'
                  )}
                </button>
                
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex flex-col">
          <div className="bg-white dark:bg-gray-800 shadow-sm p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      setNodes([]);
                      setEdges([]);
                      setCompletedNodes(new Set());
                    }}
                    className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition-colors"
                  >
                    <svg 
                      stroke="currentColor" 
                      fill="none" 
                      strokeWidth="2" 
                      viewBox="0 0 24 24" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="w-6 h-6 text-gray-900 dark:text-white" 
                      height="1em" 
                      width="1em" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      {domain} Learning Roadmap
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Progress: {calculateProgress()}%
                      </div>
                      <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress()}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={downloadAsPDF}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    <FiDownload /> Download
                  </button>
                  <button
                    onClick={shareRoadmap}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    <FiShare2 /> Share
                  </button>
                  {id ? (
                    <button
                      onClick={saveChanges}
                      disabled={saving}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave /> Save Changes
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={saveRoadmap}
                      disabled={saving}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiSave /> Save Roadmap
                        </>
                      )}
                    </button>
                  )}
                  <button
                    onClick={() => navigate('/saved-roadmaps')}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    <FiArrowRight /> See Saved Roadmaps
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800">
            <div ref={reactFlowWrapper} className="h-full w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                attributionPosition="bottom-right"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={true}
                className="h-full"
              >
                <Background gap={50} size={3} color="#94a3b8" />
                <Controls 
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700"
                  showZoom={true}
                  showFitView={true}
                  showInteractive={false}
                />
              </ReactFlow>
            </div>
          </div>
        </div>
      )}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Share Roadmap</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Share this link with others to show them your roadmap:
              </p>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              {navigator.share && (
                <button
                  onClick={() => {
                    navigator.share({
                      title: `${domain} Learning Roadmap`,
                      text: 'Check out this learning roadmap I created!',
                      url: shareUrl
                    });
                  }}
                  className="w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <FiShare2 className="w-5 h-5" />
                  Share via...
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roadmap;
