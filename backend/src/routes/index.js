import express from 'express'
import { auth, role } from '../middleware/auth.js'
import * as authCtrl from '../controllers/auth.js'
import * as attrCtrl from '../controllers/attributes.js'
import * as posCtrl from '../controllers/positions.js'
import * as profCtrl from '../controllers/profile.js'
import * as cvCtrl from '../controllers/cv.js'

const router = express.Router()

router.post('/auth/register', authCtrl.register)
router.post('/auth/login', authCtrl.login)
router.get('/auth/me', auth, authCtrl.me)

router.get('/admin/users', auth, role('admin'), authCtrl.getUsers)
router.put('/admin/users/:id/role', auth, role('admin'), authCtrl.updateRole)
router.delete('/admin/users/:id', auth, role('admin'), authCtrl.deleteUser)

router.get('/attributes', auth, attrCtrl.getAll)
router.get('/attributes/categories', auth, attrCtrl.getCategories)
router.post('/attributes', auth, role('recruiter', 'admin'), attrCtrl.create)
router.put('/attributes/:id', auth, role('recruiter', 'admin'), attrCtrl.update)
router.delete('/attributes/:id', auth, role('recruiter', 'admin'), attrCtrl.remove)

router.get('/positions', posCtrl.getAll)
router.get('/positions/:id', posCtrl.getOne)
router.post('/positions', auth, role('recruiter', 'admin'), posCtrl.create)
router.put('/positions/:id', auth, role('recruiter', 'admin'), posCtrl.update)
router.delete('/positions/:id', auth, role('recruiter', 'admin'), posCtrl.remove)
router.post('/positions/:id/duplicate', auth, role('recruiter', 'admin'), posCtrl.duplicate)

router.get('/profile/me', auth, profCtrl.get)
router.put('/profile/me', auth, profCtrl.update)

router.get('/cv/my', auth, cvCtrl.getMy)
router.get('/cv/all', auth, cvCtrl.getAll) 
router.get('/cv/:id', auth, cvCtrl.getOne)
router.post('/cv', auth, cvCtrl.createOrUpdate)
router.put('/cv/:id/publish', auth, cvCtrl.publish)
router.get('/cv/position/:positionId', auth, cvCtrl.getByPosition)

export default router
