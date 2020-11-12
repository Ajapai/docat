
import ProjectRepository from '@/repositories/ProjectRepository'

ProjectRepository.baseURL = 'https://do.cat'

const mockFetchData = (fetchData) => {
  global.fetch = jest.fn().mockImplementation(() => Promise.resolve({
    json: () => Promise.resolve(fetchData)
  }))
}


describe('ProjectRepository', () => {


  it('should return the correct logo URL', () => {
    expect(ProjectRepository.getProjectLogoURL('awesome-project'))
      .toMatch('https://do.cat/doc/awesome-project/logo.jpg')
  })


  it('should return the correct docs URL', () => {
    expect(ProjectRepository.getProjectDocsURL('pet-project', '1.0.0'))
      .toMatch('https://do.cat/doc/pet-project/1.0.0/')
  })


  it('should get all projects', async () => {
    const projects = {
      'projects': [
        { name: 'awesome-project' },
        { name: 'pet-project' }
      ]
    }
    mockFetchData(projects)

    const result = await ProjectRepository.get()

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual(projects.projects)
  })


  it('correctly get relative docs path', () => {
    const [project, version, expectedPath] = ['project', '1.0', 'index.html']
    const absoluteDocsPath = `https://do.cat/doc/${project}/${version}/${expectedPath}`

    const relativeDocsPath = ProjectRepository.getDocsPath('project', '1.0', absoluteDocsPath)

    expect(relativeDocsPath).toEqual(expectedPath)
  })


  it('should get all versions of a project', async () => {
    const versions = {
      'name': 'awesome--project',
      'versions': [
        { name: '1.0', tags: [] },
        { name: '2.0', type: [] },
      ]
    }
    mockFetchData(versions)

    const result = await ProjectRepository.getVersions('awesome--project')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(result).toEqual(versions.versions)
  })


  it('should upload new documentation', async () => {
    mockFetchData({})

    await ProjectRepository.upload('awesome-project', '4.0', { data: true })

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(global.fetch).toHaveBeenCalledWith('https://do.cat/api/awesome-project/4.0',
      {
        'body': { 'data': true },
        'method': 'POST'
      }
    )
  })
})
