export function sortVersions(versions: string[]): string[] {
  return versions
    .map(a => a.replace(/\d+/g, n => `${parseInt(n) + 100000}`))
    .sort()
    .map(a => a.replace(/\d+/g, n => `${parseInt(n) - 100000}`))
}

export function getNextPostVersion(version: string): string {
  const match = version.match(/\.post(\d+)$/)
  if (!match) return `${version}.post1`

  const post = match[1]
  const newPost = `${parseInt(post) + 1}`
  return version.replace(/\d+$/, newPost)
}

export function getStableVersion(version: string): string {
  return version.split('.').slice(0, 3).join('.')
}

export function isVersionGreater(version: string, other: string): boolean {
  const latest = sortVersions([version, other]).pop()
  return latest !== other
}

export function isStableVersionGreater(
  version: string,
  other: string
): boolean {
  return isVersionGreater(getStableVersion(version), getStableVersion(other))
}

export function getBotocoreVersion(boto3Version: string): string {
  const match = boto3Version.match(/\d+\.(\d+)\./)
  if (!match) throw new Error(`Invalid boto3 version: ${boto3Version}`)

  const minor = parseInt(match[1]) + 3
  return boto3Version.replace(/\.\d+/, `.${minor}`)
}
