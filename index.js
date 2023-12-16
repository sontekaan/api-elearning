const express = require("express");

const bodyParser = require("body-parser");

const mysql = require("mysql");

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// koneksi MySQL

const koneksi = mysql.createConnection({
  host: "localhost",

  user: "sonteka2_admin",

  password: "_9x9*410[+uJ",

  database: "sonteka2_questionbank",

  port: 3306,

  multipleStatements: true,
});

// koneksi database

koneksi.connect((err) => {
  if (err) throw err;
});

module.exports = koneksi;

app.get("/", (req, res) => {
  const output = {
    maintainer: "Muhammad Syahputra",

    github: "https://github.com/sontekaan/api-elearning",

    endpoints: [
      {
        name: "question-bank",

        paths: [
          {
            name: "course",

            path: "https://api1.sontekan.com/course",
          },

          {
            name: "question",

            path: "https://api1.sontekan.com/questions/",
          },

          {
            name: "answer",

            path: "https://api1.sontekan.com/answers",
          },
        ],
      },
    ],
  };

  res.json(output);
});

// Endpoint untuk menampilkan topik materi

app.get("/course", (req, res) => {
  // buat query sql

  const querySql = `SELECT * FROM course`;

  // jalankan query

  koneksi.query(querySql, (err, rows, fields) => {
    // error handling

    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }

    // jika request berhasil

    res.status(200).json({ success: true, data: rows });
  });
});

// Endpoint untuk menambahkan topik materi

app.post("/add-course", (req, res) => {
  // Ambil data topik materi dari body request

  const { name } = req.body;

  // Pastikan data yang diperlukan ada

  if (!name) {
    return res

      .status(400)

      .json({ success: false, message: "Mohon berikan nama topik materi." });
  }

  // Buat query SQL untuk menambahkan topik materi

  const insertTopicQuery = `INSERT INTO course (name) VALUES (?)`;

  // Jalankan query untuk menambahkan topik materi

  koneksi.query(insertTopicQuery, [name], (err, result) => {
    // Error handling

    if (err) {
      return res.status(500).json({
        success: false,

        message: "Gagal menambahkan course.",

        error: err,
      });
    }

    // Jika berhasil menambahkan topik materi

    res.status(201).json({
      success: true,

      message: "Course berhasil ditambahkan.",

      data: result.insertId,
    });
  });
});

// Endpoint untuk mengupdate topik materi berdasarkan ID

app.put("/update-course/:id", (req, res) => {
  // Ambil data topik materi yang akan diupdate dari body request

  const { name } = req.body;

  // Ambil ID topik materi dari parameter URL

  const { id } = req.params;

  // Pastikan data yang diperlukan ada

  if (!name) {
    return res

      .status(400)

      .json({ success: false, message: "Mohon berikan nama course." });
  }

  // Buat query SQL untuk mengupdate topik materi

  const updateTopicQuery = `UPDATE course SET name = ? WHERE id = ?`;

  // Jalankan query untuk mengupdate topik materi

  koneksi.query(updateTopicQuery, [name, id], (err, result) => {
    // Error handling

    if (err) {
      return res.status(500).json({
        success: false,

        message: "Gagal mengupdate topik materi.",

        error: err,
      });
    }

    // Periksa apakah data berhasil diupdate

    if (result.affectedRows === 0) {
      return res

        .status(404)

        .json({ success: false, message: "Topik materi tidak ditemukan." });
    }

    // Jika berhasil mengupdate topik materi

    res

      .status(200)

      .json({ success: true, message: "Topik materi berhasil diupdate." });
  });
});

// Endpoint untuk menghapus topik materi berdasarkan ID

app.delete("/delete-course/:id", (req, res) => {
  // Ambil ID topik materi dari parameter URL

  const { id } = req.params;

  // Buat query SQL untuk menghapus topik materi

  const deleteTopicQuery = `DELETE FROM course WHERE id = ?`;

  // Jalankan query untuk menghapus topik materi

  koneksi.query(deleteTopicQuery, [id], (err, result) => {
    // Error handling

    if (err) {
      return res.status(500).json({
        success: false,

        message: "Gagal menghapus course.",

        error: err,
      });
    }

    // Periksa apakah data berhasil dihapus

    if (result.affectedRows === 0) {
      return res

        .status(404)

        .json({ success: false, message: "Course tidak ditemukan." });
    }

    // Jika berhasil menghapus topik materi

    res

      .status(200)

      .json({ success: true, message: "Course berhasil dihapus." });
  });
});

// Endpoint untuk menampilkan semua soal

app.get("/questions", (req, res) => {
  // buat query sql

  const querySql = `SELECT * FROM question`;

  // jalankan query

  koneksi.query(querySql, (err, rows, fields) => {
    // error handling

    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }

    // jika request berhasil

    res.status(200).json({ success: true, data: rows });
  });
});

// Endpoint untuk menambahkan soal

app.post("/add-questions", (req, res) => {
  // Ambil data soal dari body request

  const { question, difficultyID, courseID } = req.body;

  // Pastikan data yang diperlukan ada

  if (!question || !difficultyID || !courseID) {
    return res

      .status(400)

      .json({ success: false, message: "Mohon lengkapi semua data soal." });
  }

  // Buat query SQL untuk menambahkan soal

  const insertQuestionQuery = `INSERT INTO question (question, difficultyID, courseID ) VALUES (?, ?, ?)`;

  // Jalankan query untuk menambahkan soal

  koneksi.query(
    insertQuestionQuery,

    [question, difficultyID, courseID],

    (err, result) => {
      // Error handling

      if (err) {
        return res.status(500).json({
          success: false,

          message: "Gagal menambahkan soal.",

          error: err,
        });
      }

      // Jika berhasil menambahkan soal

      res.status(201).json({
        success: true,

        message: "Soal berhasil ditambahkan.",

        data: result.insertId,
      });
    }
  );
});

// Endpoint untuk mengupdate soal berdasarkan ID

app.put("/update-questions/:id", (req, res) => {
  // Ambil data soal yang akan diupdate dari body request

  const { question, difficultyID, courseID } = req.body;

  // Ambil ID soal dari parameter URL

  const { id } = req.params;

  // Pastikan data yang diperlukan ada

  if (!question || !difficultyID || !courseID) {
    return res

      .status(400)

      .json({ success: false, message: "Mohon lengkapi semua data soal." });
  }

  // Buat query SQL untuk mengupdate soal

  const updateQuestionQuery = `UPDATE question SET question = ?, difficultyID = ?, courseID = ? WHERE id = ?`;

  // Jalankan query untuk mengupdate soal

  koneksi.query(
    updateQuestionQuery,

    [question, difficultyID, courseID, id],

    (err, result) => {
      // Error handling

      if (err) {
        return res.status(500).json({
          success: false,

          message: "Gagal mengupdate soal.",

          error: err,
        });
      }

      // Periksa apakah data berhasil diupdate

      if (result.affectedRows === 0) {
        return res

          .status(404)

          .json({ success: false, message: "Soal tidak ditemukan." });
      }

      // Jika berhasil mengupdate soal

      res

        .status(200)

        .json({ success: true, message: "Soal berhasil diupdate." });
    }
  );
});

// Endpoint untuk menghapus soal berdasarkan ID

app.delete("/delete-question/:id", (req, res) => {
  // Ambil ID soal dari parameter URL

  const { id } = req.params;

  // Buat query SQL untuk menghapus jawaban terkait

  const deleteAnswersQuery = `DELETE FROM answer WHERE questionID = ?`;

  // Jalankan query untuk menghapus jawaban terkait

  koneksi.query(deleteAnswersQuery, [id], (err, result) => {
    // Error handling

    if (err) {
      return res.status(500).json({
        success: false,

        message: "Gagal menghapus jawaban terkait.",

        error: err,
      });
    }

    // Buat query SQL untuk menghapus soal

    const deleteQuestionQuery = `DELETE FROM question WHERE id = ?`;

    // Jalankan query untuk menghapus soal

    koneksi.query(deleteQuestionQuery, [id], (err, result) => {
      // Error handling

      if (err) {
        return res.status(500).json({
          success: false,

          message: "Gagal menghapus soal.",

          error: err,
        });
      }

      // Periksa apakah data berhasil dihapus

      if (result.affectedRows === 0) {
        return res

          .status(404)

          .json({ success: false, message: "Soal tidak ditemukan." });
      }

      // Jika berhasil menghapus soal

      res

        .status(200)

        .json({ success: true, message: "Soal berhasil dihapus." });
    });
  });
});

// Endpoint untuk menampilkan semua jawaban

app.get("/answers", (req, res) => {
  // buat query sql

  const querySql = `SELECT * FROM answer`;

  // jalankan query

  koneksi.query(querySql, (err, rows, fields) => {
    // error handling

    if (err) {
      return res.status(500).json({ message: "Ada kesalahan", error: err });
    }

    // jika request berhasil

    res.status(200).json({ success: true, data: rows });
  });
});

// Endpoint untuk menghapus jawaban tertentu untuk Pertanyaan Tertentu

app.delete("/questions/:questionId/answers/:answerId", (req, res) => {
  // Ambil ID pertanyaan dan ID jawaban dari parameter URL

  const { questionId, answerId } = req.params;

  // Buat query SQL untuk menghapus jawaban tertentu untuk pertanyaan tertentu

  const deleteAnswerQuery = `DELETE FROM answer WHERE questionID = ? AND id = ?`;

  // Jalankan query untuk menghapus jawaban tertentu

  koneksi.query(deleteAnswerQuery, [questionId, answerId], (err, result) => {
    // Error handling

    if (err) {
      return res.status(500).json({
        success: false,

        message: "Gagal menghapus jawaban.",

        error: err,
      });
    }

    // Periksa apakah data berhasil dihapus

    if (result.affectedRows === 0) {
      return res

        .status(404)

        .json({ success: false, message: "Jawaban tidak ditemukan." });
    }

    // Jika berhasil menghapus jawaban

    res

      .status(200)

      .json({ success: true, message: "Jawaban berhasil dihapus." });
  });
});

// Endpoint untuk menghapus semua jawaban dari Pertanyaan Tertentu

app.delete("/questions/:questionId/answers", (req, res) => {
  // Ambil ID pertanyaan dari parameter URL

  const { questionId } = req.params;

  // Buat query SQL untuk menghapus semua jawaban dari pertanyaan tertentu

  const deleteAllAnswersQuery = `DELETE FROM answer WHERE questionID = ?`;

  // Jalankan query untuk menghapus semua jawaban

  koneksi.query(deleteAllAnswersQuery, [questionId], (err, result) => {
    // Error handling

    if (err) {
      return res.status(500).json({
        success: false,

        message: "Gagal menghapus semua jawaban.",

        error: err,
      });
    }

    // Jika berhasil menghapus semua jawaban

    res

      .status(200)

      .json({ success: true, message: "Semua jawaban berhasil dihapus." });
  });
});

// Endpoint untuk menambahkan jawaban baru untuk Pertanyaan Tertentu

app.post("/questions/:questionId/answers", (req, res) => {
  // Ambil data jawaban dari body request

  const { choice, answer, is_correct } = req.body;

  // Ambil ID pertanyaan dari parameter URL

  const { questionId } = req.params;

  // Pastikan data yang diperlukan ada

  if (!choice || !answer || is_correct === undefined) {
    return res

      .status(400)

      .json({ success: false, message: "Mohon lengkapi semua data jawaban." });
  }

  // Buat query SQL untuk menambahkan jawaban baru untuk pertanyaan tertentu

  const insertAnswerQuery = `INSERT INTO answer (questionID, choice, answer, is_correct) VALUES (?, ?, ?, ?)`;

  // Jalankan query untuk menambahkan jawaban baru

  koneksi.query(
    insertAnswerQuery,

    [questionId, choice, answer, is_correct],

    (err, result) => {
      // Error handling

      if (err) {
        return res.status(500).json({
          success: false,

          message: "Gagal menambahkan jawaban.",

          error: err,
        });
      }

      // Jika berhasil menambahkan jawaban baru

      res.status(201).json({
        success: true,

        message: "Jawaban berhasil ditambahkan.",

        data: result.insertId,
      });
    }
  );
});

// Jalankan server di localhost

app.listen(3000, () => {});
