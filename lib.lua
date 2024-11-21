function table.shallow_copy(self)
    local _out = {}
    for k, v in pairs(self) do _out[k] = v end
    return _out
end

function table.find(self, value)
    local __out = nil
    for k, v in pairs(self) do
        if (v == value) then
            __out = v
            break
        end
    end
    return __out
end

function string.center(str, width, sym)
    width = ((width == nil) or (width < #str)) and #str or width
    sym = sym or " "
    local leftPadding = (width - #str) // 2
    local rightPadding = width - #str - leftPadding

    return string.rep(sym, leftPadding)..str..string.rep(sym, rightPadding)
end

---@param x table
---@param preserve boolean
function vector_str(x, preserve)
    if type(x) == "table" then
		if preserve == nil then preserve = true end

        local _out = {preserve and "[" or ""}
        for i = 1, #x do
            table.insert(_out, x[i]..( (i < #x) and ", " or (preserve and "]" or "")))
        end
        return table.concat(_out)
    else
        error("parameter \"x\" should've been table!")
    end
end

---Prints the list of given parameters, but there are reserved 'sep' and 'endl' parameters
---@param params table
_print = function (params)
    params.sep = params.sep or " "
    params.endl = params.endl or "\n"

    for i = 1, #params do
        io.write(tostring(params[i])..( (i < #params) and params.sep or params.endl))
    end
end

function table.getByIndecies(self, indecies)
    local _out = {}
    for i = 1, #indecies do
        _out[i] = self[indecies[i]]
    end
    return _out
end

local function combinations(tbl, r)
    local n = #tbl
    local count = 1
    local indecies = {}
    for i = 1, r do indecies[i] = i end

    local TABLE = {}
    for i = 1, n do
        TABLE[i] = {i, tbl[i]}
    end

    local _ans = {table.getByIndecies(tbl, indecies)}
    
    local indexToChange = #indecies

    while true do
        if indexToChange ~= r then
            indecies[indexToChange] = indecies[indexToChange] + 1
            for i = indexToChange + 1, r do
                indecies[i] = indecies[i - 1] + 1
            end
            count = count + 1
            _ans[count] = table.getByIndecies(tbl, indecies)
            indexToChange = r
        end

        local exitCondition = true
        for i = r, 1, -1 do
            if (indecies[i] ~= TABLE[#tbl - r + i][1]) then
                exitCondition = false
                indexToChange = indexToChange - r + i
                break
            end
        end

        if exitCondition then break end
        if indexToChange == r then
            count = count + 1
            indecies[indexToChange] = indecies[indexToChange] + 1
            _ans[count] = table.getByIndecies(tbl, indecies)
        end  
    end

    return _ans
end

local function getPolinomialByCoefficients(coef)
    return function (x)
        local __result = 0
        for i = 0, #coef do 
            __result = __result + coef[i] * x ^ i
        end
        return __result
    end
end

---@param X table
---@param Y table
function LagrangePolynom(X, Y)
    local Coeff = {}
    local degree = math.min(#X - 1, #Y - 1)
    for i = 0, degree do
        Coeff[i] = 0
    end
    
    for i = 0, degree do
        for j = 0, degree do
            local A = 0
            local B = 1

            local newX = table.shallow_copy(X)
            table.remove(newX, j + 1)

            for _, comb in ipairs(combinations(newX, degree - i)) do
                local prod = 1
                for _, v in ipairs(comb) do
                    prod = prod * v
                end
                A = A + prod
            end
            A = A * (((degree - i) % 2 == 0) and 1 or -1)
        
            for m = 1, degree do
                B = B * (X[j + 1] - newX[m])
            end

            Coeff[i] = Coeff[i] + A * Y[j + 1] / B
        end
    end
    return getPolinomialByCoefficients(Coeff), Coeff
end

---Evaluates Newton Polynom from given X, Y tables and return this function, its coeff. and table with all deltas
---@param X table
---@param Y table
---@return function, table, table
function NewtonPolynom(X, Y)
    local deltas = {}
    local coeff = {}
    local __temp = {}
    local DELTAS = {}
    local degree = math.min(#X - 1, #Y - 1)
    for i = 0, degree do
        deltas[i] = 0
        coeff[i] = 0
        __temp[i] = Y[i + 1]
        if i < degree then
            DELTAS[i + 1] = {}
        end
    end
    
    deltas[0] = __temp[0]
    for i = 1, degree do
        for j = 0, degree - i do
            __temp[j] = (__temp[j + 1] - __temp[j]) / (X[j + i + 1] - X[j + 1])
            DELTAS[i][j + 1] = __temp[j]
        end
        deltas[i] = __temp[0]
    end

    __temp = nil
    coeff[0] = Y[1]
    for i = 1, degree do
        local newX = {}
        for index, v in pairs(X) do
            if (index <= i) then
                newX[index] = v
            end
        end
        
        for j = 0, i do
            local A = 0
            for _, comb in ipairs(combinations(newX, i - j)) do
                local prod = 1
                for _, v in ipairs(comb) do
                    prod = prod * v
                end
                A = A + prod
            end
    
            A = A * (((i - j) % 2 == 0) and 1 or -1)
            coeff[j] = coeff[j] + deltas[i] * A
        end
    end
    return getPolinomialByCoefficients(coeff), coeff, DELTAS
end