import React from "react";
import { motion } from "framer-motion";
import styles from "./UI.module.css";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className={`${styles.hero} text-center`}>
      <motion.h1
        className="fw-bold"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        File Organization Visualizer
      </motion.h1>

      <motion.p
        className="lead mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        Visualize how files are stored, indexed, and accessed like never before.
      </motion.p>

      <motion.div
        className="mt-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 100 }}
      >
        <Link to="/simulator" className={`btn btn-outline-info ${styles.btnGlow}`}>
          🚀 Start Simulation
        </Link>
      </motion.div>
    </section>
  );
};

export default HeroSection;
