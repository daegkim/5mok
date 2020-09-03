
class algorithm {
    constructor() {
        this.map = []
        this.dx = [-1, -1, 0, 1, 1, 1, 0, -1]
        this.dy = [0, 1, 1, 1, 0, -1, -1, -1]
        this.max_count = 5

        this.initMap()
        console.log('algo!')
    }

    isCheckMate = (_x, _y, _dir, _player) => {
        let count = 1
        let x = _x
        let y = _y
        let rev_dir = _dir - 4 < 0 ? _dir + 4 : _dir - 4

        //정방향으로 한 번 체크
        while (true) {
            x = x + this.dx[_dir]
            y = y + this.dy[_dir]

            if (x < 0 || y < 0 || x >= this.map.length || y >= this.map.length) {
                break
            }

            if (this.map[x][y] === _player) {
                count++
            }
            else {
                break
            }
        }

        //역방향으로 한 번 체크
        x = _x
        y = _y
        while (true) {
            x = x + this.dx[rev_dir]
            y = y + this.dy[rev_dir]

            if (x < 0 || y < 0 || x >= this.map.length || y >= this.map.length) {
                break
            }

            if (this.map[x][y] === _player) {
                count++
            }
            else {
                break
            }
        }

        //오목 여부 체크
        if (count === this.max_count) {
            return true
        }
        else {
            return false
        }
    }

    initMap = () => {
        this.map = []
        for (let i = 0; i < 18; i++) {
            this.map.push([])
            for (let j = 0; j < 18; j++) {
                this.map[i].push(0)
            }
        }
    }

    showMap = () => {
        var tmp = ''
        for(let i in this.map){
            tmp = ''
            for(let j in this.map[i]){
                tmp += (this.map[i][j] + ' ')
            }
            console.log(tmp)
        }
    }

    putStoneOnMap = (_x, _y, _player) => {
        if(this.map[_x][_y] != 0){
            console.log(_x, _y)
            console.log('해당 위치에 이미 말이 있습니다.')
            return false
        }

        this.map[_x][_y] = _player
        let result = false

        for (let dir = 0; dir < this.dx.length; dir++) {
            let x = _x + this.dx[dir]
            let y = _y + this.dy[dir]

            if (x < 0 || y < 0 || x >= this.map.length || y >= this.map.length) {
                continue;
            }

            if (this.map[x][y] === _player) {
                //방향과 함께 체크메이트 여부를 체크하는 함수를 가져오도록 하자.
                if (this.isCheckMate(_x, _y, dir, _player)) {
                    result = true
                    break
                }
            }
        }
        
        return result
    }
}

module.exports = new algorithm()