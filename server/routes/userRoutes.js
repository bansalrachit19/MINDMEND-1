import {matchTherapists} from '../controllers/userController.js'

router.post('/match-therapists', protect, matchTherapists);
