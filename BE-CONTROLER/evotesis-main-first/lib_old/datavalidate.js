function ValidateOf_Candidate(data) {
  if(!(data.misi && data.visi && data.name && data.profile && data.labelindex)) return false
  if(isNaN(data.labelindex)) return false
  return true
}
function ValidateOf_Student(data, id) {
  if(!(data.name && data.nik)) return false
  if(typeof id.split("-")[1] != 'string' || isNaN(id.split("-")[1])) return false
  return true
}

module.exports = {
  ValidateOf_Candidate,
  ValidateOf_Student,
}