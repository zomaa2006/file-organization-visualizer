import React, { useState } from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";

const teamMembers = [
  { name: "Mohamed Hazem", role: "Full Implementation / Front-end Developer & Animation", img: "" },
  { name: "Shorouk", role: "Project Structure / Initial Design", img: "" },
  { name: "Menna", role: "Documentation & Coordination", img: "" }
];

const About = () => {
  const [lang, setLang] = useState("ar");

  return (
    <Container className="py-5 text-light text-center">
      <motion.h1 initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>
        {lang === "ar" ? "عن المشروع وفريق العمل" : "About the Project & Team"}
      </motion.h1>

      <Button size="sm" onClick={()=>setLang(lang==="ar"?"en":"ar")} className="mb-4">
        {lang==="ar" ? "EN" : "AR"}
      </Button>

      <motion.p className="mb-5 text-secondary" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.2}}>
        {lang === "ar" 
          ? "هذا المشروع هو File Organization Simulator لتوضيح كيفية تخزين البيانات بطرق مختلفة وشرح الأداء لكل طريقة."
          : "This project is a File Organization Simulator to demonstrate how data is stored in different ways and explain performance for each method."
        }
      </motion.p>

      <Row className="justify-content-center">
        {teamMembers.map((member, i) => (
          <Col key={i} xs={12} sm={6} md={4} className="mb-3 d-flex">
            <motion.div
              initial={{opacity:0, y:20}}
              animate={{opacity:1, y:0}}
              transition={{delay: i*0.2}}
              className="w-100"
            >
              <Card
                className="bg-dark shadow-lg border-info text-center p-3 h-100 d-flex flex-column justify-content-start"
                style={{transition: "transform 0.3s", cursor: "pointer"}}
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(13, 202, 240, 0.7)" }}
              >
                {member.img ? (
                  <img
                    src={member.img}
                    alt={member.name}
                    className="rounded-circle mb-3 mx-auto"
                    style={{width: "120px", height:"120px", objectFit:"cover"}}
                  />
                ) : (
                  <div
                    className="rounded-circle mb-3 bg-secondary d-flex align-items-center justify-content-center text-dark mx-auto"
                    style={{width: "120px", height:"120px", fontSize:"1.5rem"}}
                  >
                    ?
                  </div>
                )}
                <h5 className="text-info mt-auto">{member.name}</h5>
                <p className="text-light">{member.role}</p>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default About;
