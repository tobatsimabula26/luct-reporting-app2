// GET /api/reports/export → Download as Excel
import { utils, writeFile } from 'xlsx';
router.get('/reports/export', async (req, res) => {
  try {
    const reports = await db('reports').select('*');
    const ws = utils.json_to_sheet(reports);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Reports');
    const filename = 'LUCT_Lecturer_Reports.xlsx';
    writeFile(wb, filename);
    res.download(filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});