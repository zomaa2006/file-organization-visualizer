
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Form, Table, Alert, Button, Row, Col, Card } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

// fade-in animation
const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

// explanations
const explanations = {
  Sequential: {
    ar: "البيانات بتتخزن وحدة وراء التانية. البحث خطي. المزايا: سهل التنفيذ، بسيط، مناسب للملفات الصغيرة. العيوب: بطيء مع البيانات الكبيرة.",
    en: "Records are stored one after another. Search is linear. Advantages: easy, simple, good for small files. Disadvantages: slow for large datasets."
  },
  Indexed: {
    ar: "يتم استخدام فهرس للوصول السريع للبيانات وانشاء قواعد البيانات. المزايا: البحث أسرع، Insert سريع نسبيًا. العيوب: يحتاج مساحة إضافية، إدارة الفهرس ممكن تكون معقدة.",
    en: "An index is used for fast access to records. Advantages: faster search, relatively fast insert. Disadvantages: requires extra space, index management can be complex."
  },
  Direct: {
    ar: "الداتا توضع مباشرة في البكت المناسب حسب دالة hash. المزايا: وصول سريع جدًا، ممتاز للبحث والإدخال. العيوب: التصادم ممكن يحدث، لا يناسب ترتيب بيانات متسلسلة.",
    en: "Data goes directly to the appropriate bucket via hash function. Advantages: very fast access, great for search/insert. Disadvantages: collisions may occur, not good for sequential ordering."
  },
  BTree: {
    ar: "شجرة متوازنة لتخزين البيانات بكفاءة. المزايا: إدراج/بحث/حذف فعال، يحافظ على التوازن. العيوب: التنفيذ أعقد، يحتاج مساحة أكبر لكل عقدة.",
    en: "Balanced tree structure for efficient data storage. Advantages: insert/search/delete efficient, maintains balance. Disadvantages: more complex implementation, requires more space per node."
  }
};

// ================= HUD Loader Component =================
const HUDLoader = ({ onFinish }) => {
  const [show, setShow] = useState(true);
  const spokenRef = useRef(false);
useEffect(() => {
  if (!spokenRef.current) {
    // إعداد Audio Synth
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = "sine"; // موجة ناعمة بدل sawtooth
    osc.frequency.value = 100; // تردد لطيف وواضح
    const gain = ctx.createGain();
    gain.gain.value = 0.05; // منخفض لتجنب الحدة

    osc.connect(gain);
    gain.connect(ctx.destination);

    // تشغيل النغمة القصيرة
    osc.start();
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2); // ينخفض تدريجيًا
    setTimeout(() => { osc.stop(); ctx.close(); }, 250); // توقف بعد 0.25 ثانية

    // Jarvis Voice
    const utter = new SpeechSynthesisUtterance("Welcome, Sir. Initializing the simulator.");
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    const enVoice = voices.find(v => /en/i.test(v.lang)) || voices[0];
    if (enVoice) utter.voice = enVoice;
    utter.rate = 1.0;
    utter.pitch = 0.95;

    window.speechSynthesis.speak(utter);
    spokenRef.current = true;
  }
}, []);

  const handleClick = () => {
    setShow(false);
    if (onFinish) onFinish();
  };

  return show ? (
    <div
      onClick={handleClick}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.95)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        overflow: "hidden"
      }}
    >
      <div style={{color:"#0dcaf0", fontSize:"2rem", fontWeight:"bold"}}>Initializing Simulator...</div>

      <div style={{position:"relative", marginTop:30, width:200, height:200}}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "linear" }}
            style={{
              width: 60 + i * 15,
              height: 60 + i * 15,
              border: "2px solid #0dcaf0",
              borderRadius: "50%",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: -(30 + i*7.5),
              marginLeft: -(30 + i*7.5),
              opacity: 0.25 + i*0.1
            }}
          />
        ))}
      </div>

      <div style={{color:"#0dcaf0", marginTop:50, fontStyle:"italic"}}>Click anywhere to continue</div>
    </div>
  ) : null;
};

// ================= Simulator Component =================
const Simulator = () => {
  const [method, setMethod] = useState("Sequential");
  const [records, setRecords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [simulated, setSimulated] = useState(false);
  const [lang, setLang] = useState("ar");
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setRecords([...records, inputValue.trim()]);
      setInputValue("");
      setSimulated(false);
    }
  };

  const handleSimulate = () => {
    if (records.length === 0) return;
    let performanceData = [];
    switch(method){
      case "Sequential":
        performanceData = [{name:"Insert", value:records.length},{name:"Search", value:records.length},{name:"Delete", value:records.length}];
        break;
      case "Indexed":
        performanceData = [{name:"Insert", value:records.length*0.8},{name:"Search", value:Math.log2(records.length)*5},{name:"Delete", value:records.length*0.8}];
        break;
      case "Direct":
        performanceData = [{name:"Insert", value:1},{name:"Search", value:1},{name:"Delete", value:1}];
        break;
      case "BTree":
        performanceData = [{name:"Insert", value:Math.log2(records.length)*2},{name:"Search", value:Math.log2(records.length)*2},{name:"Delete", value:Math.log2(records.length)*2}];
        break;
      default: performanceData=[];
    }
    setData(performanceData);
    setSimulated(true);
  };

  const renderSequential = () => (
    <motion.div variants={fadeIn} initial="hidden" animate="visible">
      <Table striped bordered hover variant="dark" responsive className="shadow-lg w-auto mx-auto mb-3">
        <thead><tr><th>#</th><th>Record</th></tr></thead>
        <tbody>
          <AnimatePresence>
            {records.map((rec,i)=>(
              <motion.tr key={i} initial={{opacity:0, x:-50}} animate={{opacity:1,x:0}} exit={{opacity:0}} transition={{duration:0.3}}>
                <td>{i+1}</td>
                <td>{rec}</td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </Table>
    </motion.div>
  );

  const renderIndexed = () => (
    <Row className="mb-3 justify-content-center">
      <Col xs={12} md={4} className="mb-3">
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Card className="p-2 bg-dark text-light shadow-lg border-info">
            <h6 className="text-info">📇 Index</h6>
            {records.map((rec,i)=>(
              <motion.div key={i} whileHover={{scale:1.05}} className="bg-info text-dark rounded p-2 mb-1">
                {i} → Record {i+1}
              </motion.div>
            ))}
          </Card>
        </motion.div>
      </Col>
      <Col xs={12} md={6}>
        <motion.div variants={fadeIn} initial="hidden" animate="visible">
          <Table striped bordered hover variant="dark" responsive className="shadow-lg">
            <thead><tr><th>#</th><th>Record</th></tr></thead>
            <tbody>
              {records.map((rec,i)=>(
                <motion.tr key={i} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}}>
                  <td>{i+1}</td>
                  <td>{rec}</td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </motion.div>
      </Col>
    </Row>
  );

  const renderDirect = () => {
    const hashBuckets = Array.from({length:5},()=>[]);
    records.forEach(rec=>hashBuckets[rec.length%5].push(rec));
    return (
      <Row className="justify-content-center mb-3">
        {hashBuckets.map((bucket,i)=>(
          <Col key={i} xs={6} sm={4} md={2} className="mb-2">
            <motion.div variants={fadeIn} initial="hidden" animate="visible">
              <Card className="p-2 bg-dark border-info shadow-lg">
                <h6 className="text-info text-center">Bucket {i}</h6>
                {bucket.length>0?bucket.map((item,j)=>(
                  <motion.div key={j} whileHover={{scale:1.1}} className="bg-info text-dark rounded p-2 mb-1 text-center">{item}</motion.div>
                )):<div className="text-secondary text-center">Empty</div>}
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    );
  };

  const renderBTree = () => {
    const levels = [];
    let levelSize=1, index=0;
    while(index<records.length){
      const level = records.slice(index, index+levelSize);
      levels.push(level);
      index+=levelSize;
      levelSize*=2;
    }
    return (
      <div className="mb-3">
        {levels.map((level,i)=>(
          <motion.div key={i} className="d-flex justify-content-center mb-3" variants={fadeIn} initial="hidden" animate="visible">
            {level.map((item,j)=>(
              <motion.div key={j} whileHover={{scale:1.15}} className="bg-info text-dark rounded p-2 mx-1 shadow-sm">{item}</motion.div>
            ))}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderVisualization = () => {
    if(records.length===0) return <Alert variant="secondary">No records entered yet</Alert>;
    switch(method){
      case "Sequential": return renderSequential();
      case "Indexed": return renderIndexed();
      case "Direct": return renderDirect();
      case "BTree": return renderBTree();
      default: return null;
    }
  };

  return (
    <Container className="py-5 text-light  text-center">
      <motion.h1 initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>🧠 File Organization Simulator</motion.h1>
      <p className="mt-3 mb-4 text-secondary">Enter records and visualize each file organization method dynamically.</p>

      <Form.Select value={method} onChange={e=>setMethod(e.target.value)} className="mb-3 text-dark w-auto mx-auto shadow-sm">
        {Object.keys(explanations).map(m=><option key={m}>{m}</option>)}
      </Form.Select>

      <Button size="sm" onClick={()=>setDescriptionOpen(!descriptionOpen)} className="mb-2">❓ Show Explanation</Button>
      {descriptionOpen && (
        <div className="p-3 bg-dark text-light rounded shadow-sm mb-3">
          {explanations[method][lang]}
          <Button size="sm" className="ms-2" onClick={()=>setLang(lang==="ar"?"en":"ar")}>{lang==="ar"?"EN":"AR"}</Button>
        </div>
      )}

      <Form className="d-flex justify-content-center mb-4">
        <Form.Control
          type="text"
          placeholder="Enter a new record and press Enter"
          value={inputValue}
          onChange={e=>setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-auto text-dark"
        />
      </Form>

      {renderVisualization()}

      {records.length>0 && <Button variant="info" onClick={handleSimulate} className="mt-3 shadow">Simulate Performance</Button>}

      {simulated && data.length>0 && (
        <div className="mt-5">
          <h3>{method} Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} className="shadow-lg">
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="value" fill="#0dcaf0" isAnimationActive={true} animationDuration={800}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Container>
  );
};

// ================= App Component =================
const App = () => {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <HUDLoader onFinish={() => setIntroDone(true)} />}
      {introDone && <Simulator />}
    </>
  );
};

export default App;
