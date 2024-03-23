export interface IBookmark {
  title: string
  thumbnail: string | null
}

export interface IElectronApi {
  electron: () => string
  chrome: () => string
  node: () => string
  doAThing: (limit: number, offset: number) => Promise<IBookmark[] | null>
}
